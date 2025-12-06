import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'zodi-list',
  templateUrl: './products-list.component.html',
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-content h1 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .filter-container {
      flex-shrink: 0;
    }

    .product-list {
      width: 100%;
      overflow: hidden;
    }

    .product-list-container {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .product-item {
      width: 100%;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .product-item zodi-product-item {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Medium screens (tablets) - 3 products per row */
    @media (max-width: 1200px) {
      .product-list-container {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
    }

    /* Small screens (mobile) - 2 products per row */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .product-list-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
    }

    /* Extra small screens */
    @media (max-width: 480px) {
      .product-list-container {
        gap: 12px;
      }
    }
  `],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  endSubs$: Subject<void> = new Subject();
  isCategoryPage = false;
  isProductsPage = false;

  isSectionVisible = true;

  constructor(
    private renderer: Renderer2,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.endSubs$))
      .subscribe((params) => {
        this._getProducts();
        this._getCategories();

        // Apply filters from search results
        if (params['brand'] || params['category'] || params['color']) {
          setTimeout(() => {
            this.applySearchFilters(params);
          }, 100);
        }
      });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }
  private _getProducts(categoriesFilter?: string[]) {
    this.productsService
      .getProducts(categoriesFilter)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        this.products = products;
      });
  }

  private applySearchFilters(params: any) {
    let filteredProducts = [...this.products];

    if (params['brand']) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.brand &&
          product.brand.toLowerCase().includes(params['brand'].toLowerCase())
      );
    }

    if (params['color']) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.colour &&
          product.colour.toLowerCase().includes(params['color'].toLowerCase())
      );
    }

    if (params['category']) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category &&
          product.category.name &&
          product.category.name
            .toLowerCase()
            .includes(params['category'].toLowerCase())
      );
    }

    this.products = filteredProducts;
  }

  onCategorySelected(category: string) {
    // Handle the selected category string
    console.log('Category selected:', category);
    // You can add logic here to filter products by the selected category
    this._getProducts(); // Refresh products or apply category filter
    this.isSectionVisible = true;
  }

  toggleCategorySelection(category: Category) {
    category.checked = !category.checked;
    // Optionally, you can also call the categoryFilter method here
    // if it's needed immediately after the selection changes.
    // this.categoryFilter();
  }

  //this method just checks to see what categories have checked in db, u need this to run whenever a cageegories banner div is clicked, this may need to go in a service
  categoryFilter() {
    const selectedCategories = this.categories
      .filter((category) => category.checked && category.id !== undefined)
      .map((category) => category.id as string);

    this._getProducts(selectedCategories);
  }
}
