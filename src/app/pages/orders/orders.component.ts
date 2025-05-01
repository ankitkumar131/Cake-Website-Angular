import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUser?.id;
    if (userId) {
      this.orderService.getUserOrders(userId).subscribe({
        next: (response: any) => {
          this.orders = response.data.orders;
        },
        error: (error: Error) => {
          console.error('Error fetching orders:', error);
        }
      });
    }
  }
}