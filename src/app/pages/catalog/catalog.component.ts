import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { ProductGridComponent } from '../../components/products/product-grid/product-grid.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductGridComponent, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8">
        {{ selectedCategory ? getCategoryTitle(selectedCategory) : 'All Products' }}
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
            <h2 class="text-lg font-semibold mb-4">Categories</h2>
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="category"
                  [checked]="!selectedCategory"
                  (change)="selectCategory(null)"
                  class="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <label for="all" class="ml-2 text-sm text-gray-700">All Products</label>
              </div>
              @for (category of categories; track category) {
                <div class="flex items-center">
                  <input
                    type="radio"
                    [id]="category"
                    name="category"
                    [checked]="selectedCategory === category"
                    (change)="selectCategory(category)"
                    class="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label [for]="category" class="ml-2 text-sm text-gray-700">{{ getCategoryTitle(category) }}</label>
                </div>
              }
            </div>

            <div class="border-t border-gray-200 my-6 pt-6">
              <h2 class="text-lg font-semibold mb-4">Price Range</h2>
              <div class="space-y-4">
                <div>
                  <label for="min-price" class="block text-sm text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    id="min-price"
                    [(ngModel)]="minPrice"
                    (change)="applyFilters()"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label for="max-price" class="block text-sm text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    id="max-price"
                    [(ngModel)]="maxPrice"
                    (change)="applyFilters()"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-6 pt-6">
              <h2 class="text-lg font-semibold mb-4">Sort By</h2>
              <select
                [(ngModel)]="sortBy"
                (change)="applyFilters()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>

            <button
              (click)="resetFilters()"
              class="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          @if (filteredProducts.length > 0) {
            <app-product-grid [products]="filteredProducts"></app-product-grid>
          } @else {
            <div class="text-center py-12 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-gray-400 mb-4">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p class="text-gray-500">Try adjusting your filters or browse a different category.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: Category | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'name-asc';
  
  categories: Category[] = [
    'cakes',
    'muffins',
    'pastries',
    'cupcakes',
    'cookies',
    'breads',
    'featured'
  ];

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts = products;
      
      // Check for category in query params
      this.route.queryParams.subscribe(params => {
        if (params['category'] && this.categories.includes(params['category'] as Category)) {
          this.selectedCategory = params['category'] as Category;
        }
        
        this.applyFilters();
      });
    });
  }

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];
    
    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.category.includes(this.selectedCategory as Category)
      );
    }
    
    // Apply price filters
    if (this.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= (this.minPrice || 0));
    }
    
    if (this.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= (this.maxPrice || Infinity));
    }
    
    // Apply sorting
    switch (this.sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }
    
    this.filteredProducts = filtered;
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'name-asc';
    this.applyFilters();
  }

  getCategoryTitle(category: Category): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}