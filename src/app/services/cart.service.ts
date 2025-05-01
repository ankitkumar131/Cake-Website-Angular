import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    this.getCart().subscribe({
      next: (response) => {
        if (response.success && response.data.populatedCart) {
          const cartItems = response.data.populatedCart.items.map((item: any) => ({
            product: item.productId,
            quantity: item.quantity
          }));
          this.itemsSubject.next(cartItems);
        }
      },
      error: (error) => console.error('Failed to load cart', error)
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cart`);
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cart/add`, { productId, quantity });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cart/remove`, {
      body: { productId }
    });
  }

  addItem(product: Product, quantity: number = 1): void {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const updatedItems = currentItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      this.itemsSubject.next(updatedItems);
    } else {
      this.itemsSubject.next([...currentItems, { product, quantity }]);
    }
  }

  removeItem(productId: string): void {
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    this.itemsSubject.next(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;

    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.itemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get totalItems(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.quantity, 
      0
    );
  }

  get totalPrice(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}