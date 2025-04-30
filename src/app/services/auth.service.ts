import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { mockUsers } from '../data/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('threemuffinsUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticated$.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    // Mock login - would be an API call in a real app
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userData } = foundUser;
      return of(userData as User).pipe(
        delay(800), // Simulate network delay
        tap(user => {
          this.currentUserSubject.next(user);
          this.isAuthenticated$.next(true);
          localStorage.setItem('threemuffinsUser', JSON.stringify(user));
        })
      );
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  signup(name: string, email: string, password: string): Observable<User> {
    // Mock signup - would be an API call in a real app
    const existingUser = mockUsers.find((u) => u.email === email);
    
    if (existingUser) {
      return throwError(() => new Error('Email already in use'));
    } else {
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
      };
      
      // In a real app, this would be added to a database
      mockUsers.push({ ...newUser, password });
      
      return of(newUser).pipe(
        delay(800), // Simulate network delay
        tap(user => {
          this.currentUserSubject.next(user);
          this.isAuthenticated$.next(true);
          localStorage.setItem('threemuffinsUser', JSON.stringify(user));
        })
      );
    }
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