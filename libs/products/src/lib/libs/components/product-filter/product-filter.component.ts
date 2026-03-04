import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BrandsService } from '../../services/brands.service';
import { CategoriesService } from '../../services/categories.service';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { Subject, takeUntil } from 'rxjs';

export interface ProductFilters {
  sizes: string[];
  categories: string[];
  colours: string[];
  brands: string[];
  heelTypes: string[];
  priceRanges: string[];
  productTypes: string[];
  onSale?: boolean;
  isClearance?: boolean;
}

@Component({
  selector: 'zodi-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() products: Product[] = []; // All products for counting
  @Output() categorySelected = new EventEmitter<string>();
  @Output() filtersChanged = new EventEmitter<ProductFilters>();

  endSubs$: Subject<void> = new Subject();

  // Filter options from database
  brands: Brand[] = [];
  categories: Category[] = [];

  // Static filter options
  sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
  ];
  productTypes = ['Shoes', 'Handbags'];
  colours = [
    'Black',
    'White',
    'Brown',
    'Tan',
    'Beige',
    'Red',
    'Blue',
    'Navy',
    'Green',
    'Pink',
    'Yellow',
    'Purple',
    'Grey',
    'Silver',
    'Gold',
  ];
  heelTypes = [
    'Flat',
    'Low Heel',
    'Mid Heel',
    'High Heel',
    'Platform',
    'Wedge',
  ];
  priceRanges = ['Under €50', '€50-€100', '€100-€200', '€200-€500', 'Over €500'];

  // Selected filter values
  selectedSizes: string[] = [];
  selectedCategories: string[] = [];
  selectedColours: string[] = [];
  selectedBrands: string[] = [];
  selectedHeelTypes: string[] = [];
  selectedPriceRanges: string[] = [];
  selectedProductTypes: string[] = [];
  selectedOnSale: boolean = false;
  selectedIsClearance: boolean = false;

  constructor(
    private router: Router,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._loadFilterData();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      // Manually trigger change detection to update the view
      this.cdr.detectChanges();
    }
  }

  private _loadFilterData() {
    this.brandsService
      .getBrands()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((brands) => {
        this.brands = brands;
      });

    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  // Product count methods
  getProductTypeCount(type: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.productType === type).length;
  }

  getOnSaleCount(): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.onSale === true).length;
  }

  getClearanceCount(): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.isClearance === true).length;
  }

  getSizeCount(size: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.size && p.size.includes(size)).length;
  }

  getCategoryCount(categoryId: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.category?.id === categoryId).length;
  }

  getColourCount(colour: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => 
      p.colour && p.colour.toLowerCase().includes(colour.toLowerCase())
    ).length;
  }

  getBrandCount(brandName: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.brand === brandName).length;
  }

  getHeelTypeCount(heelType: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => p.heelType === heelType).length;
  }

  getPriceRangeCount(priceRange: string): number {
    if (!this.products) return 0;
    return this.products.filter(p => {
      if (!p.price) return false;
      if (priceRange === 'Under €50') return p.price < 50;
      if (priceRange === '€50-€100') return p.price >= 50 && p.price <= 100;
      if (priceRange === '€100-€200') return p.price >= 100 && p.price <= 200;
      if (priceRange === '€200-€500') return p.price >= 200 && p.price <= 500;
      if (priceRange === 'Over €500') return p.price > 500;
      return false;
    }).length;
  }

  onFilterChange() {
    const filters: ProductFilters = {
      sizes: this.selectedSizes,
      categories: this.selectedCategories,
      colours: this.selectedColours,
      brands: this.selectedBrands,
      heelTypes: this.selectedHeelTypes,
      priceRanges: this.selectedPriceRanges,
      productTypes: this.selectedProductTypes,
      onSale: this.selectedOnSale,
      isClearance: this.selectedIsClearance,
    };
    
    this.filtersChanged.emit(filters);
  }

  clearAllFilters() {
    this.selectedSizes = [];
    this.selectedCategories = [];
    this.selectedColours = [];
    this.selectedBrands = [];
    this.selectedHeelTypes = [];
    this.selectedPriceRanges = [];
    this.selectedProductTypes = [];
    this.selectedOnSale = false;
    this.selectedIsClearance = false;
    this.onFilterChange();
  }

  // Checkbox helper methods
  isProductTypeSelected(type: string): boolean {
    return this.selectedProductTypes.includes(type);
  }

  toggleProductType(type: string, checked: boolean) {
    if (checked) {
      this.selectedProductTypes.push(type);
    } else {
      const index = this.selectedProductTypes.indexOf(type);
      if (index > -1) {
        this.selectedProductTypes.splice(index, 1);
      }
    }
    this.onFilterChange();
  }

  isSizeSelected(size: string): boolean {
    return this.selectedSizes.includes(size);
  }

  toggleSize(size: string, checked: boolean) {
    if (checked) {
      this.selectedSizes.push(size);
    } else {
      const index = this.selectedSizes.indexOf(size);
      if (index > -1) {
        this.selectedSizes.splice(index, 1);
      }
    }
    this.onFilterChange();
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  toggleCategory(categoryId: string, checked: boolean) {
    if (checked) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
    this.onFilterChange();
  }

  isColourSelected(colour: string): boolean {
    return this.selectedColours.includes(colour);
  }

  toggleColour(colour: string, checked: boolean) {
    if (checked) {
      this.selectedColours.push(colour);
    } else {
      const index = this.selectedColours.indexOf(colour);
      if (index > -1) {
        this.selectedColours.splice(index, 1);
      }
    }
    this.onFilterChange();
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.includes(brand);
  }

  toggleBrand(brand: string, checked: boolean) {
    if (checked) {
      this.selectedBrands.push(brand);
    } else {
      const index = this.selectedBrands.indexOf(brand);
      if (index > -1) {
        this.selectedBrands.splice(index, 1);
      }
    }
    this.onFilterChange();
  }

  isHeelTypeSelected(heelType: string): boolean {
    return this.selectedHeelTypes.includes(heelType);
  }

  toggleHeelType(heelType: string, checked: boolean) {
    if (checked) {
      this.selectedHeelTypes.push(heelType);
    } else {
      const index = this.selectedHeelTypes.indexOf(heelType);
      if (index > -1) {
        this.selectedHeelTypes.splice(index, 1);
      }
    }
    this.onFilterChange();
  }

  isPriceRangeSelected(priceRange: string): boolean {
    return this.selectedPriceRanges.includes(priceRange);
  }

  togglePriceRange(priceRange: string, checked: boolean) {
    if (checked) {
      this.selectedPriceRanges.push(priceRange);
    } else {
      const index = this.selectedPriceRanges.indexOf(priceRange);
      if (index > -1) {
        this.selectedPriceRanges.splice(index, 1);
      }
    }
    this.onFilterChange();
  }
}
