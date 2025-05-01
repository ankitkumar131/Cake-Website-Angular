import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
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
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      
      if (product) {
        // Load related products
        this.productService.getProductsByCategory(product.type[0]).subscribe(products => {
          this.relatedProducts = products
            .filter(p => p.id !== product.id)
            .slice(0, 4);
        });
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
    
    this.cartService.addItem(this.product, this.quantity);
    this.toastService.success('Added to cart', `${this.quantity} x ${this.product.name} added to your cart.`);
  }

  buyNow(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Authentication Required', 'Please log in to purchase items.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    this.cartService.addItem(this.product, this.quantity);
    this.router.navigate(['/checkout']);
  }

  goBack(): void {
    this.location.back();
  }
}