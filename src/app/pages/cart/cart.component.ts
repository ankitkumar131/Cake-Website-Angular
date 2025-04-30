import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8">
        Your Cart
      </h1>

      <div *ngIf="items.length === 0" class="text-center py-16">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <a 
          routerLink="/catalog"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block font-medium"
        >
          Shop Now
        </a>
      </div>

      <div *ngIf="items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left p-4">Product</th>
                  <th class="text-center p-4">Quantity</th>
                  <th class="text-right p-4">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of items; trackBy: trackByProductId" class="border-t">
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
                        <p class="text-sm text-gray-500">
                          <span>{{ item.product.price.toFixed(2) }} each</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4">
                    <div class="flex items-center justify-center">
                      <button
                        (click)="updateQuantity(item.product.id, item.quantity - 1)"
                        class="p-1"
                        [disabled]="item.quantity <= 1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                      </button>
                      <span class="px-4">{{ item.quantity }}</span>
                      <button
                        (click)="updateQuantity(item.product.id, item.quantity + 1)"
                        class="p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="16"/>
                          <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="p-4 text-right">
                    <div>
                      <p class="font-medium">
                        <span>{{ (item.product.price * item.quantity).toFixed(2) }}</span>
                      </p>
                      <button
                        (click)="removeItem(item.product.id)"
                        class="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 ml-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div class="border rounded-lg p-6 bg-gray-50 sticky top-24">
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
                <span>{{ (subtotal * 0.07).toFixed(2) }}</span>
              </div>
              <div class="border-t pt-3 font-bold flex justify-between">
                <span>Total</span>
                <span>{{ (subtotal * 1.07).toFixed(2) }}</span>
              </div>
            </div>
            <button
              (click)="proceedToCheckout()"
              class="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium mb-4 flex items-center justify-center"
            >
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <a
              routerLink="/catalog"
              class="w-full border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md font-medium text-center block"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class CartComponent {
  items: CartItem[] = []; // Use proper type
  subtotal = 0; // Initialize
  totalPrice = 0;

  constructor(private cartService: CartService, private toastService: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.subtotal = this.calculateSubtotal();
    });
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity >= 1) {
      this.cartService.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId: string): void {
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      this.cartService.removeItem(productId);
      this.toastService.success('Removed from cart', `${item.product.name} has been removed from your cart.`);
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  private calculateSubtotal(): number {
    return this.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  trackByProductId(index: number, item: CartItem): string {
    return item.product.id;
  }
}