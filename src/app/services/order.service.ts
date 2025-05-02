import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Order } from '../models/order.model';

interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

interface OrdersResponse {
  success: boolean;
  results: number;
  data: {
    orders: Order[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  // Create a new order
  createOrder(orderData: { 
    shippingAddress: any, 
    paymentMethod: any 
  }): Observable<Order> {
    return this.apiService.post<OrderResponse>('/orders', orderData)
      .pipe(map(response => response.data.order));
  }

  // Get all orders for the current user
  getMyOrders(): Observable<Order[]> {
    return this.apiService.get<OrdersResponse>('/orders/my-orders')
      .pipe(map(response => response.data.orders));
  }

  // Get all orders for a specific user (admin function)
  getUserOrders(userId: string): Observable<Order[]> {
    return this.apiService.get<OrdersResponse>(`/orders/user/${userId}`)
      .pipe(map(response => response.data.orders));
  }

  // Get a specific order by ID
  getOrder(orderId: string): Observable<Order> {
    return this.apiService.get<OrderResponse>(`/orders/${orderId}`)
      .pipe(map(response => response.data.order));
  }

  // Alias for getOrder to maintain compatibility
  getOrderById(orderId: string): Observable<Order> {
    return this.getOrder(orderId);
  }

  // Cancel an order
  cancelOrder(orderId: string): Observable<Order> {
    return this.apiService.patch<OrderResponse>(`/orders/${orderId}/status`, { 
      status: 'cancelled' 
    }).pipe(map(response => response.data.order));
  }

  // Admin: Get all orders
  getAllOrders(params: any = {}): Observable<{orders: Order[], pagination: any}> {
    return this.apiService.get<{
      success: boolean;
      results: number;
      totalPages: number;
      currentPage: number;
      data: { orders: Order[] };
    }>('/orders', params).pipe(
      map(response => ({
        orders: response.data.orders,
        pagination: {
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          totalResults: response.results
        }
      }))
    );
  }

  // Admin: Update order status
  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.apiService.patch<OrderResponse>(`/orders/${orderId}/status`, { status })
      .pipe(map(response => response.data.order));
  }
}