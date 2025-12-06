import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Product } from '../models/product.model';
import { map, Observable, of, catchError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiURLProducts = environment.apiURL + 'products';

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // For demo purposes, return mock data when backend is down
      if (operation === 'getProducts') {
        return of(this.getMockProducts() as any);
      }
      if (operation === 'getFeaturedProducts') {
        return of(this.getMockProducts().slice(0, 5) as any);
      }

      return of(result as T);
    };
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 'mock-1',
        name: 'Classic Leather Sneaker',
        description: 'Premium leather sneaker with modern design',
        richDescription:
          'High-quality crafted sneaker perfect for everyday wear',
        image:
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        images: [],
        brand: 'Nike',
        price: 129.99,
        category: { id: '1', name: 'Shoes', icon: 'shoe' },
        countInStock: 10,
        rating: 4.5,
        numReviews: 25,
        isFeatured: true,
        dateCreated: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        name: 'Designer Handbag',
        description: 'Elegant designer handbag for all occasions',
        richDescription: 'Luxurious handbag with premium materials',
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        images: [],
        brand: 'Coach',
        price: 299.99,
        category: { id: '2', name: 'Bags', icon: 'bag' },
        countInStock: 5,
        rating: 4.8,
        numReviews: 42,
        isFeatured: true,
        dateCreated: new Date().toISOString(),
      },
      {
        id: 'mock-3',
        name: 'Running Shoes',
        description: 'Lightweight running shoes for performance',
        richDescription: 'Advanced cushioning technology for optimal comfort',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        images: [],
        brand: 'Adidas',
        price: 159.99,
        category: { id: '1', name: 'Shoes', icon: 'shoe' },
        countInStock: 15,
        rating: 4.6,
        numReviews: 89,
        isFeatured: false,
        dateCreated: new Date().toISOString(),
      },
      {
        id: 'mock-4',
        name: 'Leather Tote Bag',
        description: 'Spacious leather tote perfect for work or travel',
        richDescription: 'Handcrafted leather bag with multiple compartments',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
        images: [],
        brand: 'Michael Kors',
        price: 249.99,
        category: { id: '2', name: 'Bags', icon: 'bag' },
        countInStock: 8,
        rating: 4.7,
        numReviews: 63,
        isFeatured: true,
        dateCreated: new Date().toISOString(),
      },
    ];
  }

  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if (categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
    }
    return this.http
      .get<Product[]>(this.apiURLProducts, { params })
      .pipe(catchError(this.handleError<Product[]>('getProducts', [])));
  }

  getProduct(productId: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiURLProducts}/${productId}`)
      .pipe(catchError(this.handleError<Product>('getProduct')));
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  updateProduct(productData: FormData, productId: string): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiURLProducts}/${productId}`,
      productData
    );
  }

  deleteProduct(productId: string) {
    return this.http.delete(`${this.apiURLProducts}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLProducts}/get/count`).pipe(
      map((objectValue: any) => objectValue.productCount),
      catchError(this.handleError<number>('getProductsCount', 0))
    );
  }

  getFeaturedProducts(count: number): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`)
      .pipe(catchError(this.handleError<Product[]>('getFeaturedProducts', [])));
  }
}
