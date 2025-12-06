import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  apiURLCategories = environment.apiURL + 'categories';

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Return mock categories when backend is down
      if (operation === 'getCategories') {
        return of(this.getMockCategories() as any);
      }

      return of(result as T);
    };
  }

  private getMockCategories(): Category[] {
    return [
      { id: '1', name: "Women's Shoes", icon: 'shoe', color: '#FF6B6B' },
      { id: '2', name: 'Handbags', icon: 'bag', color: '#4ECDC4' },
      { id: '3', name: 'Accessories', icon: 'accessory', color: '#45B7D1' },
      { id: '4', name: 'Sale', icon: 'sale', color: '#FFA07A' },
    ];
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiURLCategories)
      .pipe(catchError(this.handleError<Category[]>('getCategories', [])));
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http
      .get<Category>(`${this.apiURLCategories}/${categoryId}`)
      .pipe(catchError(this.handleError<Category>('getCategory')));
  }

  createCategory(categoryData: FormData): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, categoryData);
  }

  updateCategory(
    categoryData: FormData,
    categoryId: string
  ): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiURLCategories}/${categoryId}`,
      categoryData
    );
  }

  deleteCategory(categoryId: string) {
    return this.http.delete(`${this.apiURLCategories}/${categoryId}`);
  }
}
