import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'zodi-new-in',
  templateUrl: './new-in.component.html',
  styleUrls: ['./new-in.component.scss'],
})
export class NewInComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  newProducts: Product[] = [];
  timeFilter = 'all';
  sortOption = 'newest';
  loading = true;

  timeFilters = [
    { label: 'All New Items', value: 'all' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'This Season', value: 'season' },
  ];

  sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'A-Z', value: 'name-asc' },
  ];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this._getNewProducts();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getNewProducts() {
    this.productsService
      .getProducts()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        // Simulate new products (last 50% of products with recent dates)
        const newProductsCount = Math.floor(products.length * 0.5);
        this.newProducts = products
          .slice(-newProductsCount)
          .map((product, index) => {
            // Simulate arrival dates for the last 60 days
            const daysAgo = Math.floor(Math.random() * 60);
            const arrivalDate = new Date();
            arrivalDate.setDate(arrivalDate.getDate() - daysAgo);

            return {
              ...product,
              arrivalDate: arrivalDate,
              isNew: daysAgo <= 30, // Mark as "new" if arrived in last 30 days
            };
          });

        this._applyFilters();
        this.loading = false;
      });
  }

  onTimeFilterChange() {
    this._applyFilters();
  }

  onSortChange() {
    this._sortProducts();
  }

  private _applyFilters() {
    let filteredProducts = [...this.newProducts];

    if (this.timeFilter !== 'all') {
      const now = new Date();
      filteredProducts = filteredProducts.filter((product) => {
        if (!product.arrivalDate) return false;

        const daysDiff = Math.floor(
          (now.getTime() - product.arrivalDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        switch (this.timeFilter) {
          case '7days':
            return daysDiff <= 7;
          case '30days':
            return daysDiff <= 30;
          case 'season':
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }

    this.newProducts = filteredProducts;
    this._sortProducts();
  }

  private _sortProducts() {
    switch (this.sortOption) {
      case 'newest':
        this.newProducts.sort((a, b) => {
          if (!a.arrivalDate || !b.arrivalDate) return 0;
          return b.arrivalDate.getTime() - a.arrivalDate.getTime();
        });
        break;
      case 'oldest':
        this.newProducts.sort((a, b) => {
          if (!a.arrivalDate || !b.arrivalDate) return 0;
          return a.arrivalDate.getTime() - b.arrivalDate.getTime();
        });
        break;
      case 'price-asc':
        this.newProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        this.newProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        this.newProducts.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        );
        break;
    }
  }

  getDaysAgo(product: Product): number {
    if (!product.arrivalDate) return 0;
    const now = new Date();
    return Math.floor(
      (now.getTime() - product.arrivalDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getArrivalText(product: Product): string {
    const daysAgo = this.getDaysAgo(product);
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    if (daysAgo <= 7) return `${daysAgo} days ago`;
    if (daysAgo <= 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    return `${Math.floor(daysAgo / 30)} months ago`;
  }
}
