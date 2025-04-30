import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      @for (product of products; track product.id) {
        <app-product-card [product]="product"></app-product-card>
      }
    </div>
  `,
  styles: ``
})
export class ProductGridComponent {
  @Input({ required: true }) products: Product[] = [];
}