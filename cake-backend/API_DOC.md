# Cake Ordering Backend API Documentation

## Overview
This documentation provides comprehensive details about the Cake Ordering Backend API for integration with Angular 19 applications. The API serves as the backend for a cake ordering website, handling user authentication, product management, cart operations, and order processing.

## Base URL
All endpoints are prefixed with the API prefix (default is `/api`). If using a different prefix, make sure to adjust your requests accordingly.

## Response Format
All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful message",
  "data": { 
    // Response data specific to the endpoint
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Optional array of specific error details
  ]
}
```

## Authentication
The API uses JWT (JSON Web Token) authentication. For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

## Endpoints

### Authentication

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticates a user and returns an access token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "user_id",
        "fullname": "User Name",
        "email": "user@example.com",
        "userStatus": "Active",
        "userRole": "User",
        "avatar": "optional_avatar_url",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      "accessToken": "jwt_token_string"
    }
  }
  ```
- **Possible Errors**:
  - 400: Invalid credentials
  - 404: User not found

### User Management

#### Get Current User
- **URL**: `/user/current-user`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns the profile of the authenticated user
- **Response**:
  ```json
  {
    "success": true,
    "message": "User fetched successfully",
    "data": {
      "user": {
        "_id": "user_id",
        "fullname": "User Name",
        "email": "user@example.com",
        "userStatus": "Active",
        "userRole": "User",
        "avatar": "optional_avatar_url",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### Get User by ID
- **URL**: `/user/:userId`
- **Method**: `GET`
- **Auth Required**: Yes (Admin only)
- **Description**: Returns a specific user's profile
- **URL Parameters**: userId - The ID of the user to fetch
- **Response**: Same as Current User Response
- **Possible Errors**:
  - 403: Unauthorized access
  - 404: User not found

#### Add User
- **URL**: `/user/add`
- **Method**: `POST`
- **Description**: Registers a new user
- **Request Body**:
  ```json
  {
    "fullname": "New User",
    "email": "newuser@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "new_user_id",
        "fullname": "New User",
        "email": "newuser@example.com",
        "userStatus": "Active",
        "userRole": "User",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```
- **Possible Errors**:
  - 400: Validation errors
  - 409: Email already exists

#### Update Current User
- **URL**: `/user`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Updates the current user's profile
- **Request Body**: FormData containing user profile updates
  ```
  fullname: "Updated Name" (optional)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "user": {
        // Updated user object
      }
    }
  }
  ```

#### Change Password
- **URL**: `/user/change-password`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Changes the user's password
- **Request Body**:
  ```json
  {
    "oldPassword": "current_password",
    "newPassword": "new_password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully",
    "data": null
  }
  ```
- **Possible Errors**:
  - 400: Invalid old password
  - 400: New password cannot be the same as old password

#### Update Avatar
- **URL**: `/user/avatar`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Updates the user's avatar
- **Request Body**: FormData with avatar image
  ```
  avatar: [File]
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Avatar updated successfully",
    "data": {
      "avatarUrl": "path/to/avatar.jpg"
    }
  }
  ```

### Products

#### Create Product
- **URL**: `/product/create`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Creates a new cake product
- **Request Body**: FormData with product details and image
  ```
  name: "Chocolate Cake"
  description: "Delicious chocolate cake with frosting"
  price: "599"
  type: "chocolate"
  image: [File]
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "product": {
        "_id": "product_id",
        "name": "Chocolate Cake",
        "description": "Delicious chocolate cake with frosting",
        "price": "599",
        "type": "chocolate",
        "image": "path/to/image.jpg",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### Get All Products
- **URL**: `/product/all`
- **Method**: `GET`
- **Description**: Returns a list of all cake products
- **Query Parameters**:
  - type (optional): Filter products by type
- **Response**:
  ```json
  {
    "success": true,
    "message": "Products fetched successfully",
    "data": {
      "products": [
        {
          "_id": "product_id_1",
          "name": "Chocolate Cake",
          "description": "Delicious chocolate cake with frosting",
          "price": "599",
          "type": "chocolate",
          "image": "path/to/image1.jpg",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // More products...
      ]
    }
  }
  ```

#### Get Product By ID
- **URL**: `/product/:id`
- **Method**: `GET`
- **Description**: Returns details of a specific product
- **URL Parameters**: id - The ID of the product to fetch
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product fetched successfully",
    "data": {
      "product": {
        "_id": "product_id",
        "name": "Chocolate Cake",
        "description": "Delicious chocolate cake with frosting",
        "price": "599",
        "type": "chocolate",
        "image": "path/to/image.jpg",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```
- **Possible Errors**:
  - 404: Product not found

### Categories

#### Get All Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Description**: Returns all available cake categories
- **Response**:
  ```json
  {
    "success": true,
    "message": "Categories fetched successfully",
    "data": {
      "categories": [
        {
          "_id": "category_id_1",
          "name": "Chocolate",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // More categories...
      ]
    }
  }
  ```

### Cart

#### Add to Cart
- **URL**: `/cart/add`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Adds a product to the user's cart
- **Request Body**:
  ```json
  {
    "productId": "product_id",
    "quantity": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product added to cart",
    "data": {
      "cart": {
        "_id": "cart_id",
        "userId": "user_id",
        "items": [
          {
            "productId": "product_id",
            "quantity": 1,
            "_id": "item_id",
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
          }
        ],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```
- **Possible Errors**:
  - 400: Invalid product ID
  - 404: Product not found

#### Remove from Cart
- **URL**: `/cart/remove`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Removes a product from the user's cart
- **Request Body**:
  ```json
  {
    "productId": "product_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product removed from cart",
    "data": {
      "cart": {
        // Updated cart object
      }
    }
  }
  ```
- **Possible Errors**:
  - 404: Product not found in cart

#### Get Cart
- **URL**: `/cart`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns the user's current cart
- **Response**:
  ```json
  {
    "success": true,
    "message": "Cart fetched successfully",
    "data": {
      "cart": {
        "_id": "cart_id",
        "userId": "user_id",
        "items": [
          {
            "productId": "product_id",
            "quantity": 1,
            "_id": "item_id",
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
          }
        ],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      "populatedCart": {
        "_id": "cart_id",
        "userId": "user_id",
        "items": [
          {
            "productId": {
              "_id": "product_id",
              "name": "Chocolate Cake",
              "description": "Delicious chocolate cake with frosting",
              "price": "599",
              "type": "chocolate",
              "image": "path/to/image.jpg",
              "createdAt": "2023-01-01T00:00:00.000Z",
              "updatedAt": "2023-01-01T00:00:00.000Z"
            },
            "quantity": 1,
            "_id": "item_id"
          }
        ]
      }
    }
  }
  ```

### Orders

#### Create Order
- **URL**: `/order/create`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Creates a new order from the user's cart
- **Request Body**:
  ```json
  {
    "name": "Customer Name",
    "email": "customer@example.com",
    "address": "123 Main St",
    "city": "Cityville",
    "state": "State",
    "zipcode": "12345",
    "country": "Country"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "order": {
        "_id": "order_id",
        "userId": "user_id",
        "cartId": "cart_id",
        "name": "Customer Name",
        "email": "customer@example.com",
        "address": "123 Main St",
        "city": "Cityville",
        "state": "State",
        "zipcode": "12345",
        "country": "Country",
        "razorpayOrderId": "razorpay_order_id",
        "razorpayPaymentId": null,
        "amount": 599,
        "currency": "INR",
        "status": "Pending",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```
- **Possible Errors**:
  - 400: Validation errors
  - 404: Cart not found or empty

#### Update Order
- **URL**: `/order/update`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Updates an order (typically to confirm payment)
- **Request Body**:
  ```json
  {
    "orderId": "order_id",
    "razorpayPaymentId": "razorpay_payment_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order updated successfully",
    "data": {
      "order": {
        // Updated order object with status changed to "Paid"
      }
    }
  }
  ```
- **Possible Errors**:
  - 404: Order not found

#### Get All Orders
- **URL**: `/order/all`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns all orders for the current user
- **Response**:
  ```json
  {
    "success": true,
    "message": "Orders fetched successfully",
    "data": {
      "orders": [
        {
          "_id": "order_id_1",
          "userId": "user_id",
          "cartId": "cart_id",
          "name": "Customer Name",
          "email": "customer@example.com",
          "address": "123 Main St",
          "city": "Cityville",
          "state": "State",
          "zipcode": "12345",
          "country": "Country",
          "razorpayOrderId": "razorpay_order_id",
          "razorpayPaymentId": "razorpay_payment_id",
          "amount": 599,
          "currency": "INR",
          "status": "Paid",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        // More orders...
      ]
    }
  }
  ```

#### Get Order By ID
- **URL**: `/order/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns details of a specific order
- **URL Parameters**: id - The ID of the order to fetch
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order fetched successfully",
    "data": {
      "order": {
        "_id": "order_id",
        "userId": "user_id",
        "cartId": "cart_id",
        "name": "Customer Name",
        "email": "customer@example.com",
        "address": "123 Main St",
        "city": "Cityville",
        "state": "State",
        "zipcode": "12345",
        "country": "Country",
        "razorpayOrderId": "razorpay_order_id",
        "razorpayPaymentId": "razorpay_payment_id",
        "amount": 599,
        "currency": "INR",
        "status": "Paid",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```
- **Possible Errors**:
  - 404: Order not found

## Data Models

### User Model
```typescript
interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string; // Hashed, never returned in responses
  userStatus: 'Active' | 'Inactive';
  avatar?: string;
  userRole: 'Admin' | 'Application-Admin' | 'User';
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  createdAt: string;
  updatedAt: string;
}
```

### Product Model
```typescript
interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  type: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
```

### Category Model
```typescript
interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### Cart Model
```typescript
interface CartItem {
  productId: string; // Reference to Product
  quantity: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Cart {
  _id: string;
  userId: string; // Reference to User
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
```

### Order Model
```typescript
interface Order {
  _id: string;
  userId: string; // Reference to User
  cartId: string; // Reference to Cart
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}
```

## Angular 19 Integration Guide

### Setting Up Environment

Create environment files for different deployment scenarios:

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-url.com/api'
};
```

### Authentication Service

Create a service to handle authentication:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('accessToken', response.data.accessToken);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/current-user`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && 
      (currentUser.userRole === 'Admin' || currentUser.userRole === 'Application-Admin');
  }
}
```

### HTTP Interceptor

Create an interceptor to automatically attach the JWT token to all requests:

```typescript
import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

### Product Service

Create a service to interact with product endpoints:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/all`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product/create`, productData);
  }
}
```

### Cart Service

Create a service to interact with cart endpoints:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cart`);
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cart/add`, { productId, quantity });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cart/remove`, { 
      body: { productId } 
    });
  }
}
```

### Order Service

Create a service to interact with order endpoints:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
```

### User Service

Create a service to interact with user endpoints:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  updateProfile(userData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user`, userData);
  }

  changePassword(passwords: { oldPassword: string, newPassword: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/change-password`, passwords);
  }

  updateAvatar(avatarData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/avatar`, avatarData);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/add`, userData);
  }
}
```

### Authentication Guard

Create a route guard to protect authenticated routes:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
```

### Admin Guard

Create a route guard specifically for admin routes:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    this.router.navigate(['/']);
    return false;
  }
}
```

### Setting Up Angular Modules

Configure your app module to use the HTTP interceptor:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    // Other components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Best Practices for API Integration

1. **Error Handling**: Implement a centralized error handling strategy
   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpErrorResponse } from '@angular/common/http';
   import { throwError } from 'rxjs';

   @Injectable({
     providedIn: 'root'
   })
   export class ErrorHandlingService {
     handleError(error: HttpErrorResponse) {
       let errorMessage = 'An unknown error occurred';
       
       if (error.error?.message) {
         errorMessage = error.error.message;
       } else if (error.message) {
         errorMessage = error.message;
       }
       
       return throwError(() => new Error(errorMessage));
     }
   }
   ```

2. **Loading States**: Manage loading states for API calls
   ```typescript
   // In your component
   loading = false;

   loadProducts() {
     this.loading = true;
     this.productService.getAllProducts().subscribe({
       next: (response) => {
         this.products = response.data.products;
         this.loading = false;
       },
       error: (error) => {
         console.error('Error loading products', error);
         this.loading = false;
       }
     });
   }
   ```

3. **Form Validation**: Implement robust form validation
   ```typescript
   import { FormBuilder, FormGroup, Validators } from '@angular/forms';

   // In your component
   loginForm: FormGroup;

   constructor(private fb: FormBuilder) {
     this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]]
     });
   }

   login() {
     if (this.loginForm.valid) {
       const { email, password } = this.loginForm.value;
       this.authService.login(email, password).subscribe({
         next: (response) => {
           // Handle successful login
         },
         error: (error) => {
           // Handle login error
         }
       });
     } else {
       // Mark all fields as touched to trigger validation messages
       Object.keys(this.loginForm.controls).forEach(key => {
         this.loginForm.get(key)?.markAsTouched();
       });
     }
   }
   ```

4. **State Management**: Consider using NgRx for more complex applications
   ```typescript
   // Install NgRx packages
   // npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
   ```

## Deployment Considerations

1. **Environment Configuration**: Use environment variables for different deployment environments
2. **CORS**: Ensure the backend has proper CORS configuration for your Angular app domain
3. **Security**: Follow security best practices:
   - Never store sensitive data in localStorage
   - Implement proper token refresh mechanisms
   - Use HTTPS for all API communication
4. **Performance**: Optimize API calls:
   - Implement caching for frequently used data
   - Use lazy loading for Angular modules
   - Consider implementing pagination for large data sets

## Troubleshooting Common Issues

1. **CORS Errors**: 
   - Ensure the backend CORS configuration includes your Angular app origin
   - Check for missing HTTP headers in requests

2. **Authentication Issues**:
   - Verify token format and expiration
   - Check if tokens are properly stored and attached to requests

3. **Form Submission Problems**:
   - Validate form data format matches API expectations
   - For file uploads, ensure the correct multipart/form-data format

4. **API Response Handling**:
   - Ensure proper error handling for different HTTP status codes
   - Verify response format parsing

## Example Implementation

Here's an example of a product listing component:

```typescript
// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts()
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load products';
          return throwError(() => err);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.products = response.data.products;
        }
      });
  }

  addToCart(productId: string): void {
    this.cartService.addToCart(productId, 1)
      .subscribe({
        next: (response) => {
          // Handle successful addition to cart
          console.log('Product added to cart:', response);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
  }
}
```

```html
<!-- product-list.component.html -->
<div class="container">
  <h2>Our Cakes</h2>
  
  <div *ngIf="loading" class="loading-spinner">
    Loading products...
  </div>
  
  <div *ngIf="error" class="alert alert-danger">
    {{ error }}
  </div>
  
  <div class="products-grid" *ngIf="!loading && !error">
    <div class="product-card" *ngFor="let product of products">
      <img [src]="product.image" [alt]="product.name">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <p class="price">₹{{ product.price }}</p>
      <button (click)="addToCart(product._id)">Add to Cart</button>
    </div>
  </div>
  
  <div *ngIf="!loading && !error && products.length === 0" class="no-products">
    No products available at the moment.
  </div>
</div>
```

This documentation provides a comprehensive guide to integrating your Angular 19 application with the cake ordering backend API. Follow these guidelines to ensure a smooth integration experience. 