import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'zodi-clearance',
  templateUrl: './clearance.component.html',
  styleUrls: ['./clearance.component.scss'],
})
export class ClearanceComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  clearanceProducts: Product[] = [];
  sortOption = 'discount-high';
  loading = true;

  sortOptions = [
    { label: 'Highest Discount', value: 'discount-high' },
    { label: 'Lowest Price', value: 'price-low' },
    { label: 'Highest Price', value: 'price-high' },
    { label: 'A-Z', value: 'name-asc' },
  ];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this._getClearanceProducts();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getClearanceProducts() {
    this.productsService
      .getProducts()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        // Filter products with discounts (assuming originalPrice exists)
        this.clearanceProducts = products.filter((product) => {
          return (
            product.originalPrice &&
            product.price &&
            product.originalPrice > product.price
          );
        });

        // If no originalPrice field exists, simulate clearance items (last 30% of products)
        if (this.clearanceProducts.length === 0) {
          const clearanceCount = Math.floor(products.length * 0.3);
          this.clearanceProducts = products
            .slice(-clearanceCount)
            .map((product) => ({
              ...product,
              originalPrice: (product.price || 0) * 1.5, // Simulate original price
            }));
        }

        this._sortProducts();
        this.loading = false;
      });
  }

  onSortChange() {
    this._sortProducts();
  }

  private _sortProducts() {
    switch (this.sortOption) {
      case 'discount-high':
        this.clearanceProducts.sort((a, b) => {
          const discountA = this._getDiscountPercentage(a);
          const discountB = this._getDiscountPercentage(b);
          return discountB - discountA;
        });
        break;
      case 'price-low':
        this.clearanceProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        this.clearanceProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        this.clearanceProducts.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        );
        break;
    }
  }

  getDiscountPercentage(product: Product): number {
    return this._getDiscountPercentage(product);
  }

  private _getDiscountPercentage(product: Product): number {
    if (!product.originalPrice || !product.price) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }

  getSavingsAmount(product: Product): number {
    if (!product.originalPrice || !product.price) return 0;
    return product.originalPrice - product.price;
  }
}
