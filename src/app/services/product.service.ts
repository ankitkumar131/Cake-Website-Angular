import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

interface ProductsResponse {
  success: boolean;
  results: number;
  totalPages: number;
  currentPage: number;
  data: {
    products: Product[];
  };
}

interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private featuredProductsSubject = new BehaviorSubject<Product[]>([]);
  public featuredProducts$ = this.featuredProductsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadFeaturedProducts();
  }

  // Transform MongoDB _id to id for frontend use
  private transformProduct(product: any): Product {
    if (!product) return product;
    
    // If the product has _id but no id, use _id as id
    if (product._id && !product.id) {
      return {
        ...product,
        id: product._id
      };
    }
    return product;
  }

  // Transform an array of products
  private transformProducts(products: any[]): Product[] {
    if (!products) return [];
    return products.map(product => this.transformProduct(product));
  }

  // Get all products with optional filtering
  getProducts(params: any = {}): Observable<{products: Product[], pagination: any}> {
    return this.apiService.get<ProductsResponse>('/products', params).pipe(
      map(response => ({
        products: this.transformProducts(response.data.products),
        pagination: {
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          totalResults: response.results
        }
      }))
    );
  }

  // Alias for getProducts to maintain compatibility
  getAllProducts(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(response => response.products)
    );
  }

  // Get a single product by ID
  getProduct(id: string): Observable<Product> {
    return this.apiService.get<ProductResponse>(`/products/${id}`).pipe(
      map(response => this.transformProduct(response.data.product))
    );
  }

  // Alias for getProduct to maintain compatibility
  getProductById(id: string): Observable<Product> {
    return this.getProduct(id);
  }

  // Get products by category
  getProductsByCategory(category: string, params: any = {}): Observable<{products: Product[], pagination: any}> {
    return this.apiService.get<ProductsResponse>('/products', { 
      ...params, 
      category 
    }).pipe(
      map(response => ({
        products: this.transformProducts(response.data.products),
        pagination: {
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          totalResults: response.results
        }
      }))
    );
  }

  // Get featured products
  loadFeaturedProducts(): void {
    this.apiService.get<ProductsResponse>('/products', { featured: true })
      .subscribe({
        next: (response) => {
          this.featuredProductsSubject.next(this.transformProducts(response.data.products));
        },
        error: (error) => {
          console.error('Failed to load featured products', error);
        }
      });
  }

  // Get featured products (returns Observable)
  getFeaturedProducts(): Observable<Product[]> {
    return this.featuredProducts$;
  }

  // Admin: Create product
  createProduct(productData: Omit<Product, 'id'>): Observable<Product> {
    return this.apiService.post<ProductResponse>('/products', productData).pipe(
      map(response => this.transformProduct(response.data.product))
    );
  }

  // Admin: Update product
  updateProduct(id: string, productData: Partial<Product>): Observable<Product> {
    return this.apiService.patch<ProductResponse>(`/products/${id}`, productData).pipe(
      map(response => this.transformProduct(response.data.product))
    );
  }

  // Admin: Delete product
  deleteProduct(id: string): Observable<any> {
    return this.apiService.delete(`/products/${id}`);
  }

  // Search products
  searchProducts(query: string): Observable<Product[]> {
    return this.apiService.get<ProductsResponse>('/products', { 
      search: query 
    }).pipe(
      map(response => this.transformProducts(response.data.products))
    );
  }
}