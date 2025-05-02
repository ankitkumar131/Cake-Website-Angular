import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../models/order.model';

interface ExtendedOrder extends Order {
  cancelling?: boolean;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: `./orders.component.html`,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  orders: ExtendedOrder[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.toastService.error('Error', 'Failed to load your orders. Please try again.');
        this.isLoading = false;
      }
    });
  }

  cancelOrder(orderId: string): void {
    // Don't proceed if orderId is empty
    if (!orderId) {
      this.toastService.error('Error', 'Invalid order ID. Cannot cancel order.');
      return;
    }
    
    const order = this.orders.find(o => o._id === orderId || o.id === orderId);
    if (!order) return;
    
    order.cancelling = true;
    
    this.orderService.cancelOrder(orderId).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => (o._id === orderId || o.id === orderId));
        if (index !== -1) {
          this.orders[index] = { ...updatedOrder, cancelling: false };
          this.toastService.success('Order Cancelled', 'Your order has been cancelled successfully.');
        }
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        if (order) order.cancelling = false;
        this.toastService.error('Error', 'Failed to cancel order. Please try again.');
      }
    });
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}