import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8">
        Checkout
      </h1>

      <div *ngIf="cartItems.length === 0" class="text-center py-16">
        <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-8">
          You need to add items to your cart before checking out.
        </p>
        <a 
          routerLink="/catalog"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block font-medium"
        >
          Shop Now
        </a>
      </div>

      <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <!-- Checkout Steps -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <ng-container *ngFor="let step of steps; let last = last">
                <div class="flex items-center">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    [ngClass]="{
                      'bg-primary text-white': currentStep >= step.id,
                      'bg-gray-200 text-gray-500': currentStep < step.id
                    }"
                  >
                    {{ step.id }}
                  </div>
                  <span 
                    class="ml-2 text-sm font-medium"
                    [ngClass]="{
                      'text-gray-900': currentStep >= step.id,
                      'text-gray-500': currentStep < step.id
                    }"
                  >
                    {{ step.name }}
                  </span>
                </div>
                
                <div *ngIf="!last" class="flex-1 border-t border-gray-300 mx-4"></div>
              </ng-container>
            </div>
          </div>

          <!-- Step 1: Shipping Information -->
          <div *ngIf="currentStep === 1" class="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form (ngSubmit)="goToNextStep()" #shippingForm="ngForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="space-y-2">
                  <label for="firstName" class="block text-sm font-medium">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    [(ngModel)]="shippingInfo.firstName"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <label for="lastName" class="block text-sm font-medium">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    [(ngModel)]="shippingInfo.lastName"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div class="space-y-2 mb-4">
                <label for="address" class="block text-sm font-medium">Street Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  [(ngModel)]="shippingInfo.address"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="space-y-2">
                  <label for="city" class="block text-sm font-medium">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    [(ngModel)]="shippingInfo.city"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <label for="state" class="block text-sm font-medium">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    [(ngModel)]="shippingInfo.state"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <label for="zipCode" class="block text-sm font-medium">ZIP Code</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    [(ngModel)]="shippingInfo.zipCode"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div class="space-y-2 mb-6">
                <label for="phone" class="block text-sm font-medium">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  [(ngModel)]="shippingInfo.phone"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="submit"
                  class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium"
                  [disabled]="!shippingForm.form.valid"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Payment Method -->
          <div *ngIf="currentStep === 2" class="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 class="text-xl font-semibold mb-4">Payment Method</h2>
            
            <form (ngSubmit)="goToNextStep()" #paymentForm="ngForm">
              <div class="space-y-4 mb-6">
                <div class="flex items-center">
                  <input
                    id="creditCard"
                    name="paymentType"
                    type="radio"
                    value="creditCard"
                    [(ngModel)]="paymentInfo.type"
                    required
                    class="h-4 w-4 text-primary border-gray-300"
                  />
                  <label for="creditCard" class="ml-2 text-sm font-medium">Credit Card</label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="paypal"
                    name="paymentType"
                    type="radio"
                    value="paypal"
                    [(ngModel)]="paymentInfo.type"
                    required
                    class="h-4 w-4 text-primary border-gray-300"
                  />
                  <label for="paypal" class="ml-2 text-sm font-medium">PayPal</label>
                </div>
              </div>
              
              <div *ngIf="paymentInfo.type === 'creditCard'" class="space-y-4 mb-6">
                <div class="space-y-2">
                  <label for="cardNumber" class="block text-sm font-medium">Card Number</label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    [(ngModel)]="paymentInfo.cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="expiryDate" class="block text-sm font-medium">Expiry Date</label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="text"
                      [(ngModel)]="paymentInfo.expiryDate"
                      placeholder="MM/YY"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="cvv" class="block text-sm font-medium">CVV</label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      [(ngModel)]="paymentInfo.cvv"
                      placeholder="123"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label for="nameOnCard" class="block text-sm font-medium">Name on Card</label>
                  <input
                    id="nameOnCard"
                    name="nameOnCard"
                    type="text"
                    [(ngModel)]="paymentInfo.nameOnCard"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div class="flex justify-between">
                <button 
                  type="button"
                  (click)="goToPreviousStep()"
                  class="border border-gray-300 hover:border-gray-400 px-6 py-2 rounded-md font-medium"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium"
                  [disabled]="!paymentForm.form.valid"
                >
                  Continue to Review
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: Review Order -->
          <div *ngIf="currentStep === 3" class="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 class="text-xl font-semibold mb-4">Review Order</h2>
            
            <div class="mb-6">
              <h3 class="font-medium mb-2">Shipping Information</h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <p>{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</p>
                <p>{{ shippingInfo.address }}</p>
                <p>{{ shippingInfo.city }}, {{ shippingInfo.state }} {{ shippingInfo.zipCode }}</p>
                <p>{{ shippingInfo.phone }}</p>
              </div>
            </div>
            
            <div class="mb-6">
              <h3 class="font-medium mb-2">Payment Method</h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <div *ngIf="paymentInfo.type === 'creditCard'">
                  <p>Credit Card</p>
                  <p *ngIf="paymentInfo.cardNumber">**** **** **** {{ paymentInfo.cardNumber.slice(-4) }}</p>
                </div>
                <div *ngIf="paymentInfo.type === 'paypal'">
                  <p>PayPal</p>
                </div>
              </div>
            </div>
            
            <div class="mb-6">
              <h3 class="font-medium mb-2">Order Items</h3>
              <div class="border rounded-md overflow-hidden">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="text-left p-3">Product</th>
                      <th class="text-center p-3">Quantity</th>
                      <th class="text-right p-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of cartItems; trackBy: trackByProductId" class="border-t">
                      <td class="p-3">
                        <div class="flex items-center space-x-3">
                          <img
                            [src]="item.product.image"
                            [alt]="item.product.name"
                            class="w-12 h-12 object-cover rounded-md"
                          />
                          <span>{{ item.product.name }}</span>
                        </div>
                      </td>
                      <td class="p-3 text-center">{{ item.quantity }}</td>
                      <td class="p-3 text-right">{{ (item.product.price * item.quantity).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="flex justify-between">
              <button 
                type="button"
                (click)="goToPreviousStep()"
                class="border border-gray-300 hover:border-gray-400 px-6 py-2 rounded-md font-medium"
              >
                Back
              </button>
              <button 
                type="button"
                (click)="placeOrder()"
                class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium"
                [disabled]="isPlacingOrder"
              >
                <span *ngIf="isPlacingOrder" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span *ngIf="!isPlacingOrder">Place Order</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <div class="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>{{ tax.toFixed(2) }}</span>
              </div>
              <div class="border-t pt-3 font-bold flex justify-between">
                <span>Total</span>
                <span>{{ total.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let item of cartItems; trackBy: trackByProductId" class="flex items-start space-x-3">
                <img
                  [src]="item.product.image"
                  [alt]="item.product.name"
                  class="w-12 h-12 object-cover rounded-md"
                />
                <div class="flex-1">
                  <p class="font-medium">{{ item.product.name }}</p>
                  <div class="flex justify-between text-sm text-gray-500">
                    <span>Qty: {{ item.quantity }}</span>
                    <span>{{ (item.product.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  cartItems: any[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;

  currentStep = 1;
  steps = [
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Review' }
  ];

  shippingInfo = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  };
  
  paymentInfo = {
    type: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  };

  isPlacingOrder = false;

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
    
    // Pre-fill user info if available
    const user = this.authService.currentUser;
    if (user) {
      this.shippingInfo.firstName = user.name.split(' ')[0];
      this.shippingInfo.lastName = user.name.split(' ').slice(1).join(' ');
    }
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.totalPrice;
    this.tax = this.subtotal * 0.07; // 7% tax
    this.total = this.subtotal + this.tax;
  }

  goToNextStep(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  trackByProductId(index: number, item: any): string {
    return item.product.id;
  }

  placeOrder(): void {
    if (!this.authService.currentUser) {
      this.toastService.error('Authentication Required', 'Please log in to place an order.');
      this.router.navigate(['/login']);
      return;
    }
    
    this.isPlacingOrder = true;
    
    // Prepare shipping address
    const shippingAddress = {
      name: `${this.shippingInfo.firstName} ${this.shippingInfo.lastName}`,
      street: this.shippingInfo.address,
      city: this.shippingInfo.city,
      state: this.shippingInfo.state,
      zipCode: this.shippingInfo.zipCode,
      country: 'United States'
    };
    
    // Prepare payment method
    const paymentMethod = {
      type: this.paymentInfo.type,
      last4: this.paymentInfo.type === 'creditCard' ? this.paymentInfo.cardNumber?.slice(-4) : undefined
    };
    
    // Create order
    this.orderService.createOrder({
      shippingAddress,
      paymentMethod
    }).subscribe({
      next: (order) => {
        this.isPlacingOrder = false;
        this.toastService.success('Order Placed', 'Your order has been successfully placed!');
        this.router.navigate(['/order-confirmation'], { state: { order } });
      },
      error: (error) => {
        this.isPlacingOrder = false;
        this.toastService.error('Order Failed', 'There was an error placing your order. Please try again.');
        console.error('Order error:', error);
      }
    });
  }
}