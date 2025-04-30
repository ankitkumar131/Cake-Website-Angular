import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { products, getFeaturedProducts, getProductsByCategory, getProductById } from '../data/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() { }

  getAllProducts(): Observable<Product[]> {
    return of(products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(getProductById(id));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(getFeaturedProducts());
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(getProductsByCategory(category));
  }
}