import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    // Load cart from localStorage on initial load
    const savedCart = localStorage.getItem('threemuffinsCart');
    if (savedCart) {
      try {
        this.itemsSubject.next(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }

    // Save cart to localStorage whenever it changes
    this.items$.subscribe(items => {
      localStorage.setItem('threemuffinsCart', JSON.stringify(items));
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