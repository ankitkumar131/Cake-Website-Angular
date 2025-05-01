import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { mockUsers } from '../data/users';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('threemuffinsUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticated$.next(true);
    }
  }

  login(data: any) {
    return this.http.post(`${environment.apiUrl}auth/login`, data);
  }

  signup(data: any) {
    return this.http.post(`${environment.apiUrl}user/add`, data);
  }

  logout(): Observable<void> {
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
    localStorage.removeItem('threemuffinsUser');
    return of(undefined);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }
}
