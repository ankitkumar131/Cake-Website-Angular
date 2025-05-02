import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product, getProductId } from '../../../models/product.model';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <a [routerLink]="['/products', getProductId(product)]" class="product-card group block">
        <div class="relative overflow-hidden aspect-square">
          <img
            [src]="product.image"
            [alt]="product.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          @if (product.featured) {
            <span class="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          }
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-1 text-brand-darkBrown">
            {{ product.name }}
          </h3>
          <p class="text-gray-500 text-sm mb-2 line-clamp-2">
            {{ product.description }}
          </p>
          <div class="flex items-center justify-between mt-3">
            <span class="font-bold text-lg">{{ product.price.toFixed(2) }}</span>
            <button
              (click)="addToCart($event)"
              class="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Add
            </button>
          </div>
        </div>
      </a>
    </div>
  `,
  styles: ``
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Make getProductId available in the template
  protected getProductId = getProductId;

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Authentication Required', 'Please log in to add items to your cart.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    // Add to cart using the service
    this.cartService.addItem(this.product).subscribe({
      next: () => {
        this.toastService.success('Added to cart', `${this.product.name} has been added to your cart.`);
      },
      error: (error) => {
        console.error('Error adding to cart', error);
        this.toastService.error('Error', 'Could not add item to cart. Please try again.');
      }
    });
  }
}