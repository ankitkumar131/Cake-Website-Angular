import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import {
  products,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
} from '../data/products';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(`${environment.apiUrl}product/all`);
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
