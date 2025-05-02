import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product, getProductId } from '../models/product.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: string;
}

interface CartResponse {
  success: boolean;
  data: {
    cart: Cart;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();
  public items$ = this.cart$.pipe(
    map(cart => cart?.items || [])
  );

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    // Load cart when user logs in or out
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.clearLocalCart();
      }
    });

    // Initial cart load
    this.loadCart();
  }

  private loadCart(): void {
    if (this.authService.isAuthenticated) {
      this.apiService.get<CartResponse>('/cart')
        .subscribe({
          next: (response) => {
            this.cartSubject.next(response.data.cart);
            console.log('Loaded server cart:', response.data.cart);
          },
          error: (error) => {
            console.error('Failed to load cart', error);
            // Try to merge local cart with server if there's a local cart
            const localCart = this.getLocalCart();
            if (localCart && localCart.items.length > 0) {
              console.log('Merging local cart with server cart');
              this.syncLocalCartToServer(localCart);
            } else {
              // Initialize an empty cart
              this.cartSubject.next({
                user: this.authService.currentUser?.id || '',
                items: [],
                totalAmount: 0,
                updatedAt: new Date().toISOString()
              });
            }
          }
        });
    } else {
      // For non-authenticated users, use local storage cart
      this.loadLocalCart();
    }
  }

  private getLocalCart(): Cart | null {
    const savedCart = localStorage.getItem('cakeWebsiteCart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart) as Cart;
      } catch (e) {
        console.error('Failed to parse saved cart', e);
        return null;
      }
    }
    return null;
  }

  private loadLocalCart(): void {
    const cart = this.getLocalCart();
    if (cart) {
      this.cartSubject.next(cart);
    } else {
      this.clearLocalCart();
    }
  }

  private syncLocalCartToServer(localCart: Cart): void {
    // Process items one by one to avoid overwhelming the server
    if (localCart.items.length === 0) return;
    
    // Take the first item
    const item = localCart.items[0];
    this.apiService.post<CartResponse>('/cart/add', {
      productId: getProductId(item.product),
      quantity: item.quantity
    }).subscribe({
      next: () => {
        // Continue with the rest of the items
        const remainingItems = localCart.items.slice(1);
        if (remainingItems.length > 0) {
          this.syncLocalCartToServer({
            ...localCart,
            items: remainingItems
          });
        } else {
          // All items synced, refresh the cart from server
          this.apiService.get<CartResponse>('/cart').subscribe(response => {
            this.cartSubject.next(response.data.cart);
            // Clear local cart since it's now on the server
            localStorage.removeItem('cakeWebsiteCart');
          });
        }
      },
      error: (error) => {
        console.error('Error syncing item to server cart', error);
      }
    });
  }

  private saveLocalCart(cart: Cart): void {
    localStorage.setItem('cakeWebsiteCart', JSON.stringify(cart));
  }

  private clearLocalCart(): void {
    localStorage.removeItem('cakeWebsiteCart');
    this.cartSubject.next({
      user: '',
      items: [],
      totalAmount: 0,
      updatedAt: new Date().toISOString()
    });
  }

  addItem(product: Product, quantity: number = 1): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.apiService.post<CartResponse>('/cart/add', {
        productId: getProductId(product),
        quantity
      }).pipe(
        map(response => response.data.cart),
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      // For non-authenticated users, handle locally
      const currentCart = this.cartSubject.value || {
        user: '',
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString()
      };

      const existingItemIndex = currentCart.items.findIndex(
        item => getProductId(item.product) === getProductId(product)
      );

      if (existingItemIndex > -1) {
        currentCart.items[existingItemIndex].quantity += quantity;
      } else {
        currentCart.items.push({
          product,
          quantity,
          price: product.price
        });
      }

      // Recalculate total
      currentCart.totalAmount = this.calculateTotal(currentCart.items);
      currentCart.updatedAt = new Date().toISOString();

      this.cartSubject.next(currentCart);
      this.saveLocalCart(currentCart);

      return new Observable<Cart>(observer => {
        observer.next(currentCart);
        observer.complete();
      });
    }
  }

  updateQuantity(productId: string, quantity: number): Observable<Cart | null> {
    if (quantity < 1) return this.cart$;

    if (this.authService.isAuthenticated) {
      return this.apiService.patch<CartResponse>('/cart/update', {
        productId,
        quantity
      }).pipe(
        map(response => response.data.cart),
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      // For non-authenticated users, handle locally
      const currentCart = this.cartSubject.value;
      if (!currentCart) return this.cart$;

      const updatedItems = currentCart.items.map(item =>
        getProductId(item.product) === productId ? { ...item, quantity } : item
      );

      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        totalAmount: this.calculateTotal(updatedItems),
        updatedAt: new Date().toISOString()
      };

      this.cartSubject.next(updatedCart);
      this.saveLocalCart(updatedCart);

      return new Observable<Cart>(observer => {
        observer.next(updatedCart);
        observer.complete();
      });
    }
  }

  removeItem(productId: string): Observable<Cart | null> {
    if (this.authService.isAuthenticated) {
      return this.apiService.delete<CartResponse>(`/cart/items/${productId}`).pipe(
        map(response => response.data.cart),
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      // For non-authenticated users, handle locally
      const currentCart = this.cartSubject.value;
      if (!currentCart) return this.cart$;

      const updatedItems = currentCart.items.filter(
        item => getProductId(item.product) !== productId
      );

      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        totalAmount: this.calculateTotal(updatedItems),
        updatedAt: new Date().toISOString()
      };

      this.cartSubject.next(updatedCart);
      this.saveLocalCart(updatedCart);

      return new Observable<Cart>(observer => {
        observer.next(updatedCart);
        observer.complete();
      });
    }
  }

  clearCart(): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.apiService.delete<CartResponse>('/cart/clear').pipe(
        map(response => response.data.cart),
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      // For non-authenticated users, handle locally
      this.clearLocalCart();

      // Create a default empty cart if value is null
      const emptyCart: Cart = this.cartSubject.value || {
        user: '',
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString()
      };

      return new Observable<Cart>(observer => {
        observer.next(emptyCart);
        observer.complete();
      });
    }
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get items(): CartItem[] {
    return this.cartSubject.value?.items || [];
  }

  get totalItems(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity, 
      0
    );
  }

  get totalPrice(): number {
    return this.cartSubject.value?.totalAmount || 0;
  }
}