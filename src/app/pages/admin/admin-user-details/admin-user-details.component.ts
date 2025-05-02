import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.scss']
})
export class AdminUserDetailsComponent implements OnInit {
  user: User | null = null;
  userOrders: Order[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isLoading = true;
      
      // Load user details
      this.adminService.getUser(userId).subscribe({
        next: (userData) => {
          this.user = userData;
          this.loadUserOrders(userId);
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.toastService.error('Error', 'Failed to load user details');
          this.router.navigate(['/admin/users']);
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  loadUserOrders(userId: string): void {
    this.orderService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.userOrders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user orders:', error);
        this.isLoading = false;
      }
    });
  }

  toggleActiveStatus(): void {
    if (!this.user) return;
    
    const newStatus = !this.user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    // Use _id if defined, otherwise fall back to id
    const userId = this.user._id || this.user.id;
    
    if (confirm(`Are you sure you want to ${action} this user's account?`)) {
      this.adminService.updateUserStatus(userId, newStatus).subscribe({
        next: () => {
          if (this.user) {
            this.user.isActive = newStatus;
          }
          this.toastService.success('Status Updated', `User account has been ${action}d successfully`);
        },
        error: (error) => {
          console.error(`Error ${action}ing user:`, error);
          this.toastService.error('Error', `Failed to ${action} user account`);
        }
      });
    }
  }
}
