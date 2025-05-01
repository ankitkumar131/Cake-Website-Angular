import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserOrders(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/user/${userId}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/order/create`, orderData);
  }

  updateOrder(orderId: string, razorpayPaymentId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/order/update`, {
      orderId,
      razorpayPaymentId
    });
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/all`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/${id}`);
  }
}