import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
}

interface DashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    recentOrders: any[];
    lowStockProducts: any[];
  };
}

interface UsersResponse {
  success: boolean;
  results: number;
  totalPages: number;
  currentPage: number;
  data: {
    users: User[];
  };
}

interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  // Get dashboard statistics
  getDashboardStats(): Observable<{
    stats: DashboardStats;
    recentOrders: any[];
    lowStockProducts: any[];
  }> {
    return this.apiService.get<DashboardResponse>('/admin/dashboard')
      .pipe(map(response => response.data));
  }

  // Get all users
  getUsers(params: any = {}): Observable<{users: User[], pagination: any}> {
    return this.apiService.get<UsersResponse>('/admin/users', params)
      .pipe(
        map(response => ({
          users: response.data.users,
          pagination: {
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            totalResults: response.results
          }
        }))
      );
  }

  // Get user by ID
  getUser(userId: string): Observable<User> {
    return this.apiService.get<UserResponse>(`/admin/users/${userId}`)
      .pipe(map(response => response.data.user));
  }

  // Update user
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.apiService.patch<UserResponse>(`/admin/users/${userId}`, userData)
      .pipe(map(response => response.data.user));
  }

  // Update user status (activate/deactivate)
  updateUserStatus(userId: string, isActive: boolean): Observable<User> {
    return this.updateUser(userId, { isActive } as any);
  }

  // Delete user
  deleteUser(userId: string): Observable<any> {
    return this.apiService.delete(`/admin/users/${userId}`);
  }

  // Create admin user
  createAdmin(adminData: { name: string; email: string; password: string }): Observable<User> {
    return this.apiService.post<UserResponse>('/admin/create', adminData)
      .pipe(map(response => response.data.user));
  }
} 