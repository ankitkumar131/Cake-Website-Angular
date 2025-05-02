import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <button
        (click)="goBack()"
        class="mb-8 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Orders
      </button>

      <div *ngIf="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      <div *ngIf="!order" class="text-center py-16">
        <h2 class="text-2xl font-semibold mb-4">Order Not Found</h2>
        <p class="mb-8">The order you're looking for doesn't exist.</p>
        <a 
          routerLink="/orders"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block font-medium"
        >
          Return to Orders
        </a>
      </div>
      <div *ngIf="order" class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-pacifico text-brand-darkBrown">
            Order Details
          </h1>
          <span 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            [ngClass]="{
              'bg-green-100 text-green-800': order.status === 'delivered',
              'bg-blue-100 text-blue-800': order.status === 'processing',
              'bg-yellow-100 text-yellow-800': order.status === 'pending',
              'bg-red-100 text-red-800': order.status === 'cancelled'
            }"
          >
            {{ capitalizeFirstLetter(order.status) }}
          </span>
        </div>
        
        <div class="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Order Information</h2>
            <span class="text-sm text-gray-500">Order #{{ order.id }}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="font-medium mb-2">Order Date</h3>
              <p class="text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <h3 class="font-medium mb-2">Payment Method</h3>
              <p class="text-gray-600">
                <span *ngIf="order.paymentMethod.type === 'creditCard'">
                  Credit Card ending in {{ order.paymentMethod.last4 }}
                </span>
                <span *ngIf="order.paymentMethod.type !== 'creditCard'">
                  PayPal
                </span>
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="font-medium mb-2">Shipping Address</h3>
              <div class="text-gray-600">
                <p>{{ order.shippingAddress?.name }}</p>
                <p>{{ order.shippingAddress?.street }}</p>
                <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.state }} {{ order.shippingAddress?.zipCode }}</p>
                <p>{{ order.shippingAddress?.country }}</p>
              </div>
            </div>
            <div>
              <h3 class="font-medium mb-2">Order Summary</h3>
              <div class="space-y-1 text-gray-600">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>{{ (order.totalAmount / 1.07).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div class="flex justify-between">
                  <span>Tax</span>
                  <span>{{ (order.totalAmount - (order.totalAmount / 1.07)).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{{ order.totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 class="text-xl font-semibold p-6 border-b">Order Items</h2>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left p-4">Product</th>
                <th class="text-center p-4">Quantity</th>
                <th class="text-right p-4">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of order.items; trackBy: trackByProductId" class="border-t">
                <td class="p-4">
                  <div class="flex items-center space-x-4">
                    <img
                      [src]="item.product.image"
                      [alt]="item.product.name"
                      class="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <a
                        [routerLink]="['/products', item.product.id]"
                        class="font-medium hover:text-primary"
                      >
                        {{ item.product.name }}
                      </a>
                      <p class="text-sm text-gray-500">{{ item.product.price.toFixed(2) }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-center">{{ item.quantity }}</td>
                <td class="p-4 text-right font-medium">
                  {{ (item.product.price * item.quantity).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private orderService = inject(OrderService);
  
  order: Order | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderService.getOrderById(id).subscribe({
          next: (order) => {
            this.order = order || null;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching order:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  goBack(): void {
    this.location.back();
  }

  trackByProductId(index: number, item: any): number {
    return item.product.id;
  }
}