# Muffin Magic Angular

This is an Angular 19 version of the Muffin Magic Cart e-commerce application.

## Project Overview

Muffin Magic Cart (branded as "ThreeMuffins" in the UI) is an e-commerce web application for a bakery business. The application allows users to browse bakery products, add them to a cart, and complete the checkout process.

## Tech Stack

- **Frontend Framework**: Angular 19
- **Styling**: Tailwind CSS with custom theming
- **State Management**: Angular Services with RxJS
- **Form Handling**: Angular Forms
- **Routing**: Angular Router

## Project Structure

The project follows a well-organized structure:
- `/src/app/components`: Reusable UI components
- `/src/app/services`: Angular services for state management and API calls
- `/src/app/data`: Mock data for products and orders
- `/src/app/models`: TypeScript interfaces
- `/src/app/pages`: Page components for different routes
- `/src/app/guards`: Route guards for authentication

## Key Features

### 1. Product Catalog
- Display of products with images, descriptions, and prices
- Product categorization (cakes, muffins, pastries, cupcakes, cookies, breads)
- Featured products section
- Product detail pages with nutritional information and ingredients

### 2. Shopping Cart
- Add/remove products to cart
- Update product quantities
- Persistent cart (stored in localStorage)
- Cart summary with subtotal, tax, and total calculations

### 3. User Authentication
- Login/signup functionality
- Mock authentication (simulated backend)
- Protected routes requiring authentication
- User profile and order history

### 4. Checkout Process
- Multi-step checkout form
- Shipping information collection
- Payment method selection (credit card, PayPal)
- Order confirmation

### 5. UI/UX Features
- Responsive design for mobile and desktop
- Animated transitions
- Toast notifications for user actions
- Form validation
- Loading states

## Pages

- Home (`/`)
- Product catalog (`/catalog`)
- Product details (`/products/:id`)
- Cart (`/cart`)
- Checkout (`/checkout`)
- Order confirmation (`/order-confirmation`)
- Order history (`/orders`)
- Order details (`/orders/:id`)
- Authentication pages (`/login`, `/signup`)
- Information pages (`/about`, `/contact`, `/faq`, `/terms`)
- Not found page (`/**`)

## Services

- **AuthService**: Handles user authentication and session management
- **CartService**: Manages the shopping cart state
- **ProductService**: Provides product data
- **OrderService**: Handles order creation and retrieval
- **ToastService**: Manages toast notifications

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `ng serve`
4. Open your browser to `http://localhost:4200`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Demo Credentials

For testing purposes, you can use the following credentials:
- Email: john@example.com
- Password: password123

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
