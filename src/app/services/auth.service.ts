import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCurrentUser();
    }
  }

  private loadCurrentUser(): void {
    this.http.get<any>(`${this.apiUrl}/user/current-user`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
          }
        },
        error: () => {
          this.logout();
        }
      });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('token', response.data.accessToken);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
          }
        })
      );
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/add`, userData)
      .pipe(
        catchError(error => {
          console.error('Signup error details:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.isAuthenticated$.next(false);
      })
    );
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }
}