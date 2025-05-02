# Cake Website Backend API

This is the backend API for the Cake Website e-commerce application built with Express, MongoDB, and Node.js.

## Setup Instructions

1. Install MongoDB if not already installed
2. Install dependencies:
```
cd API-endpoints
npm install
```

3. Create a `.env` file in the API-endpoints directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cake-website
JWT_SECRET=cakes_are_delicious_secret_2024
JWT_EXPIRES_IN=30d
ADMIN_EMAIL=admin@cakewebsite.com
ADMIN_PASSWORD=admin1234
```

4. Start the server:
```
npm run dev
```

The server will run on http://localhost:5000 by default.

## API Endpoints

### Authentication

- **POST /api/auth/signup**: Register a new user
  - Body: `{ name, email, password }`
  - Returns: User and JWT token

- **POST /api/auth/login**: Login an existing user
  - Body: `{ email, password }`
  - Returns: User and JWT token

- **GET /api/auth/me**: Get current user profile
  - Header: Authorization: Bearer {token}
  - Returns: User profile

- **PATCH /api/auth/update-profile**: Update user profile
  - Header: Authorization: Bearer {token}
  - Body: `{ name, email, phone, address }`
  - Returns: Updated user

### Products

- **GET /api/products**: Get all products
  - Query parameters: 
    - `category`: Filter by category
    - `featured`: Filter featured products (true/false)
    - `search`: Search query string
    - `page`: Page number for pagination
    - `limit`: Items per page
    - `sort`: Sort field (prefix with - for descending)
  - Returns: Products list with pagination

- **GET /api/products/:id**: Get a specific product
  - Returns: Single product

- **POST /api/products**: Create a new product (admin only)
  - Header: Authorization: Bearer {token}
  - Body: Product data
  - Returns: Created product

- **PATCH /api/products/:id**: Update a product (admin only)
  - Header: Authorization: Bearer {token}
  - Body: Product data to update
  - Returns: Updated product

- **DELETE /api/products/:id**: Delete a product (admin only)
  - Header: Authorization: Bearer {token}
  - Returns: No content

### Cart

- **GET /api/cart**: Get user's cart
  - Header: Authorization: Bearer {token}
  - Returns: Cart with items

- **POST /api/cart/add**: Add item to cart
  - Header: Authorization: Bearer {token}
  - Body: `{ productId, quantity }`
  - Returns: Updated cart

- **PATCH /api/cart/update**: Update cart item quantity
  - Header: Authorization: Bearer {token}
  - Body: `{ productId, quantity }`
  - Returns: Updated cart

- **DELETE /api/cart/items/:productId**: Remove item from cart
  - Header: Authorization: Bearer {token}
  - Returns: Updated cart

- **DELETE /api/cart/clear**: Clear cart
  - Header: Authorization: Bearer {token}
  - Returns: Empty cart

### Orders

- **POST /api/orders**: Create a new order
  - Header: Authorization: Bearer {token}
  - Body: `{ shippingAddress, paymentMethod }`
  - Returns: Created order

- **GET /api/orders/my-orders**: Get user's orders
  - Header: Authorization: Bearer {token}
  - Returns: List of user's orders

- **GET /api/orders/:id**: Get specific order
  - Header: Authorization: Bearer {token}
  - Returns: Order details

- **GET /api/orders**: Get all orders (admin only)
  - Header: Authorization: Bearer {token}
  - Query parameters: pagination parameters
  - Returns: All orders with pagination

- **PATCH /api/orders/:id/status**: Update order status (admin only)
  - Header: Authorization: Bearer {token}
  - Body: `{ status }`
  - Returns: Updated order

### Admin

- **GET /api/admin/dashboard**: Get dashboard statistics (admin only)
  - Header: Authorization: Bearer {token}
  - Returns: Dashboard statistics

- **GET /api/admin/users**: Get all users (admin only)
  - Header: Authorization: Bearer {token}
  - Query parameters: pagination parameters
  - Returns: Users list with pagination

- **GET /api/admin/users/:id**: Get specific user (admin only)
  - Header: Authorization: Bearer {token}
  - Returns: User details

- **PATCH /api/admin/users/:id**: Update user (admin only)
  - Header: Authorization: Bearer {token}
  - Body: User data to update
  - Returns: Updated user

- **DELETE /api/admin/users/:id**: Delete user (admin only)
  - Header: Authorization: Bearer {token}
  - Returns: No content

- **POST /api/admin/create**: Create admin user (admin only)
  - Header: Authorization: Bearer {token}
  - Body: `{ name, email, password }`
  - Returns: Created admin user

## Admin Access

When the server starts, it automatically creates an admin user if none exists, using the credentials from the .env file. You can use these credentials to log in to the admin dashboard.

Default admin credentials:
- Email: admin@cakewebsite.com
- Password: admin1234

Admin dashboard is accessible at `/admin` in the frontend application. 