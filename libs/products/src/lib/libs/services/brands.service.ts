import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Brand } from '../models/brand.model';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  apiURLBrands = environment.apiURL + 'brands';

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiURLBrands);
  }

  getFeaturedBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiURLBrands}/featured`);
  }

  getBrand(brandId: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiURLBrands}/${brandId}`);
  }

  createBrand(brandData: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.apiURLBrands, brandData);
  }

  updateBrand(brandData: Brand, brandId: string): Observable<Brand> {
    return this.http.put<Brand>(
      `${this.apiURLBrands}/${brandId}`,
      brandData
    );
  }

  deleteBrand(brandId: string) {
    return this.http.delete(`${this.apiURLBrands}/${brandId}`);
  }
}
