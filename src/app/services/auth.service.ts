import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiService } from './api.service';

interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private tokenKey = 'cakeWebsiteAuthToken';

  constructor(private apiService: ApiService) {
    // Check if token exists in local storage
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.fetchCurrentUser().subscribe({
        next: () => {},
        error: () => this.logout()
      });
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.apiService.post<AuthResponse>('/auth/login', { email, password })
      .pipe(
        map(response => {
          if (response.success && response.token && response.data.user) {
            // Save token and set current user
            localStorage.setItem(this.tokenKey, response.token);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
            return response.data.user;
          } else {
            throw new Error('Invalid response format');
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  signup(name: string, email: string, password: string): Observable<User> {
    return this.apiService.post<AuthResponse>('/auth/signup', { name, email, password })
      .pipe(
        map(response => {
          if (response.success && response.token && response.data.user) {
            // Save token and set current user
            localStorage.setItem(this.tokenKey, response.token);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
            return response.data.user;
          } else {
            throw new Error('Invalid response format');
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Signup failed'));
        })
      );
  }

  logout(): Observable<void> {
    // Clear token and user data
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
    return of(undefined);
  }

  fetchCurrentUser(): Observable<User> {
    return this.apiService.get<{success: boolean, data: {user: User}}>('/auth/me')
      .pipe(
        map(response => {
          if (response.success && response.data.user) {
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
            return response.data.user;
          } else {
            throw new Error('Failed to fetch user data');
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => new Error('Session expired, please login again'));
        })
      );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.patch<{success: boolean, data: {user: User}}>('/auth/update-profile', userData)
      .pipe(
        map(response => {
          if (response.success && response.data.user) {
            this.currentUserSubject.next(response.data.user);
            return response.data.user;
          } else {
            throw new Error('Failed to update profile');
          }
        })
      );
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }
}