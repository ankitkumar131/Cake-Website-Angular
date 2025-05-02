import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.scss']
})
export class AdminOrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  isUpdating = false;
  selectedStatus = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrder(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.selectedStatus = order.status;
          this.isLoading = false;
          this.error = '';
        },
        error: (error) => {
          console.error('Error loading order:', error);
          this.toastService.error('Error', 'Failed to load order details');
          this.router.navigate(['/admin/orders']);
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/admin/orders']);
    }
  }

  updateStatus(): void {
    if (!this.order || this.selectedStatus === this.order.status) return;
    
    // Verify authentication token exists
    if (!this.authService.getAuthToken()) {
      this.toastService.error('Authentication Error', 'Your session has expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
    
    const orderId = this.order._id || this.order.id;
    
    this.isUpdating = true;
    this.error = '';
    
    this.orderService.updateOrderStatus(orderId, this.selectedStatus).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.toastService.success('Status Updated', `Order status has been updated to ${this.selectedStatus}`);
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.error = error.error?.message || 'Failed to update order status. Please try again.';
        this.toastService.error('Error', this.error);
        this.isUpdating = false;
        
        // If we got a 401 error, redirect to login
        if (error.status === 401) {
          this.toastService.error('Authentication Error', 'Your session has expired. Please log in again.');
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
