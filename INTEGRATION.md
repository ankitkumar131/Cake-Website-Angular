# Frontend and Backend Integration Guide

This document outlines how to set up and integrate the Angular frontend with the MongoDB/Express backend for the Cake Website.

## Setup Steps

### 1. Backend Setup

1. Navigate to the API-endpoints directory:
```
cd API-endpoints
```

2. Install the dependencies:
```
npm install
```

3. Create a `.env` file with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cake-website
JWT_SECRET=cakes_are_delicious_secret_2024
JWT_EXPIRES_IN=30d
ADMIN_EMAIL=admin@cakewebsite.com
ADMIN_PASSWORD=admin1234
```

4. Start the backend server:
```
npm run dev
```

The backend will run on http://localhost:5000

### 2. Frontend Setup

1. Navigate to the project root directory and install dependencies:
```
npm install
```

2. Start the Angular development server:
```
npm start
```

The frontend will run on http://localhost:4200

## Integration Points

The frontend and backend are integrated through RESTful APIs. The key integration points are:

### Authentication
- Registration and login use JWT tokens stored in localStorage
- The AuthInterceptor automatically adds the token to API requests
- User sessions are managed through the AuthService

### Products
- Product catalog loads from the backend API
- Product details, filtering, and search are handled on the server side
- Admin users can manage products through the admin interface

### Cart
- Cart data is saved to MongoDB for authenticated users
- For non-authenticated users, cart data is stored in localStorage
- When a user logs in, their localStorage cart is merged with their server cart

### Orders
- Orders are created from the cart data
- Order history and details are fetched from the backend
- Order status updates are managed by admin users

### Admin Dashboard
- Admin routes are protected by the adminGuard
- Dashboard statistics are fetched from the backend
- Product, order, and user management is available to admin users

## Testing the Integration

1. Create a user account through the signup form
2. Browse products and add some to your cart
3. Complete the checkout process to create an order
4. Log in as an admin to view and manage orders, products, and users

## Admin Access

Initial admin credentials:
- Email: admin@cakewebsite.com
- Password: admin1234

Admin dashboard is accessible at: http://localhost:4200/admin

## Data Flow

1. User Registration/Login:
   - Frontend collects credentials
   - Backend validates and returns JWT token
   - Frontend stores token in localStorage

2. Product Browsing:
   - Frontend requests products from backend
   - Backend queries MongoDB and returns products
   - Frontend displays products with filtering/pagination

3. Cart Management:
   - Frontend sends cart changes to backend API
   - Backend updates cart in MongoDB
   - Frontend displays updated cart

4. Order Placement:
   - Frontend sends order details to backend
   - Backend creates order in MongoDB
   - Backend updates product inventory
   - Frontend redirects to order confirmation

5. Admin Operations:
   - Admin views dashboard with statistics
   - Admin manages products, orders, users
   - Changes are persisted to MongoDB 