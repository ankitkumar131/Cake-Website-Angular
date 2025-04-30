import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../models/order.model';
import { orders, getUserOrders, getOrderById } from '../data/orders';
import { CartService, CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private cartService: CartService) { }

  getAllOrders(): Observable<Order[]> {
    return of(orders);
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(getOrderById(id));
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return of(getUserOrders(userId));
  }

  createOrder(userId: string, shippingAddress: any, paymentMethod: any): Observable<Order> {
    // Create a new order from the cart items
    const items = this.cartService.items;
    const totalAmount = this.cartService.totalPrice;
    
    // Generate a random order ID
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    
    const newOrder: Order = {
      id: orderId,
      userId,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price * item.quantity
      })),
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
      paymentMethod
    };
    
    // In a real app, this would be sent to a backend API
    orders.push(newOrder);
    
    // Clear the cart after creating the order
    this.cartService.clearCart();
    
    return of(newOrder);
  }
}