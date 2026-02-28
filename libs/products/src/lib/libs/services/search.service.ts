import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SearchResult } from '../models/search-result.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { environment } from '../../../../../../environments/environment';
import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiURL = environment.apiURL;

  constructor(
    private http: HttpClient,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  search(query: string): Observable<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    const normalizedQuery = query.toLowerCase().trim();

    return forkJoin({
      products: this.productsService
        .getProducts()
        .pipe(catchError(() => of([] as Product[]))),
      categories: this.categoriesService
        .getCategories()
        .pipe(catchError(() => of([] as Category[]))),
    }).pipe(
      map(({ products, categories }) => {
        const results: SearchResult[] = [];
        const addedBrands = new Set<string>();

        // Search products by name, brand, color, description
        const matchingProducts = products.filter(
          (product) =>
            this.matchesQuery(product.name, normalizedQuery) ||
            this.matchesQuery(product.brand, normalizedQuery) ||
            this.matchesQuery(product.colour, normalizedQuery) ||
            this.matchesQuery(product.description, normalizedQuery) ||
            this.matchesQuery(product.richDescription, normalizedQuery)
        );

        // Add matching products
        matchingProducts.forEach((product) => {
          results.push({
            type: 'product',
            id: product.id ?? '',
            name: product.name ?? '',
            image: product.image ?? undefined,
            brand: product.brand ?? undefined,
            colour: product.colour ?? undefined,
          });
        });

        // Extract and add unique brands from all products
        products.forEach((product) => {
          if (
            product.brand &&
            this.matchesQuery(product.brand, normalizedQuery) &&
            !addedBrands.has(product.brand.toLowerCase())
          ) {
            addedBrands.add(product.brand.toLowerCase());
            results.push({
              type: 'brand',
              name: product.brand,
              image: undefined, // Could add brand logos later
            });
          }
        });

        // Add matching categories
        categories.forEach((category) => {
          if (this.matchesQuery(category.name, normalizedQuery)) {
            results.push({
              type: 'category',
              name: category.name ?? '',
            });
          }
        });

        // Extract and add unique colors from products
        const addedColors = new Set<string>();
        products.forEach((product) => {
          if (
            product.colour &&
            this.matchesQuery(product.colour, normalizedQuery) &&
            !addedColors.has(product.colour.toLowerCase()) &&
            !results.some(
              (r) => r.type === 'color' && r.name === product.colour
            )
          ) {
            addedColors.add(product.colour.toLowerCase());
            results.push({
              type: 'color',
              name: product.colour,
            });
          }
        });

        // Sort results: exact matches first, then partial matches
        return results
          .sort((a, b) => {
            const aExact = a.name.toLowerCase() === normalizedQuery;
            const bExact = b.name.toLowerCase() === normalizedQuery;
            const aStarts = a.name.toLowerCase().startsWith(normalizedQuery);
            const bStarts = b.name.toLowerCase().startsWith(normalizedQuery);

            if (aExact && !bExact) return -1;
            if (bExact && !aExact) return 1;
            if (aStarts && !bStarts) return -1;
            if (bStarts && !aStarts) return 1;
            return 0;
          })
          .slice(0, 15); // Limit to 15 results
      })
    );
  }

  private matchesQuery(text: string | undefined, query: string): boolean {
    if (!text) return false;
    return text.toLowerCase().includes(query);
  }
}
