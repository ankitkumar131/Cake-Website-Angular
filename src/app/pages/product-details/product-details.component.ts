import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Product, getProductId } from '../../models/product.model';
import { ProductGridComponent } from '../../components/products/product-grid/product-grid.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductGridComponent, FormsModule],
  templateUrl: `./product-details.component.html`,
  styles: ``
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  product: Product | undefined;
  relatedProducts: Product[] = [];
  quantity = 1;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        
        if (product) {
          // Load related products
          this.productService.getProductsByCategory(product.category[0]).subscribe(response => {
            this.relatedProducts = response.products
              .filter(p => getProductId(p) !== getProductId(product))
              .slice(0, 4);
          });
        }
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.toastService.error('Product not found', 'Could not load the requested product.');
        this.router.navigate(['/catalog']);
      }
    });
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity >= 1) {
      this.quantity = newQuantity;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Authentication Required', 'Please log in to add items to your cart.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    this.cartService.addItem(this.product, this.quantity).subscribe({
      next: () => {
        this.toastService.success('Added to cart', `${this.quantity} x ${this.product?.name} added to your cart.`);
      },
      error: (error) => {
        console.error('Error adding to cart', error);
        this.toastService.error('Error', 'Could not add item to cart. Please try again.');
      }
    });
  }

  buyNow(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Authentication Required', 'Please log in to purchase items.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    this.cartService.addItem(this.product, this.quantity).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      },
      error: (error) => {
        console.error('Error adding to cart for buy now', error);
        this.toastService.error('Error', 'Could not process your request. Please try again.');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}