import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'zodi-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent {
  @Output() categorySelected = new EventEmitter<string>();

  // Filter options
  sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  categories = ['Shoes', 'Handbags', 'Accessories', 'Clothing'];
  colours = [
    'Black',
    'White',
    'Brown',
    'Red',
    'Blue',
    'Green',
    'Pink',
    'Yellow',
    'Purple',
    'Grey',
  ];
  brands = [
    'Zodi',
    'Nike',
    'Adidas',
    'Puma',
    'Gucci',
    'Prada',
    'Louis Vuitton',
    'Chanel',
  ];
  heelTypes = [
    'Flat',
    'Low Heel',
    'Mid Heel',
    'High Heel',
    'Platform',
    'Wedge',
  ];
  prices = ['Under €50', '€50-€100', '€100-€200', '€200-€500', 'Over €500'];

  // Selected filter values
  selectedSizes: string[] = [];
  selectedCategories: string[] = [];
  selectedColours: string[] = [];
  selectedBrands: string[] = [];
  selectedHeelTypes: string[] = [];
  selectedPrices: string[] = [];

  constructor(private router: Router) {}

  onFilterChange() {
    // Emit filter changes to parent component
    console.log('Filters changed:', {
      sizes: this.selectedSizes,
      categories: this.selectedCategories,
      colours: this.selectedColours,
      brands: this.selectedBrands,
      heelTypes: this.selectedHeelTypes,
      prices: this.selectedPrices,
    });
  }

  clearAllFilters() {
    this.selectedSizes = [];
    this.selectedCategories = [];
    this.selectedColours = [];
    this.selectedBrands = [];
    this.selectedHeelTypes = [];
    this.selectedPrices = [];
    this.onFilterChange();
  }
}
