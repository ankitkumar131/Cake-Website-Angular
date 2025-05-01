import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/product/all`)
      .pipe(map(response => response.data.products));
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<any>(`${this.apiUrl}/product/${id}`)
      .pipe(map(response => response.data.product));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/product/featured`)
      .pipe(map(response => response.data.products));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/product/category/${category}`)
      .pipe(map(response => response.data.products));
  }
}