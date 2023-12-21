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
  styles: [],
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
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if (params['categoryid']) {
        this._getProducts([params['categoryid']]);
        this.isCategoryPage = true;
      } else {
        this._getProducts();
        this.isCategoryPage = false;
      }
    });
    this._getCategories();

    // Check if URL ends with '/products'
    this.route.url.subscribe((urlSegments) => {
      this.isProductsPage =
        urlSegments[urlSegments.length - 1].path === 'products';
      this.applyResponsiveStyles(); // Apply styles initially
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

  applyResponsiveStyles() {
    if (this.isProductsPage && window.innerWidth <= 700) {
      // Apply styles for URL ending with '/products' and screen less than 700px
      this.renderer.addClass(document.body, 'responsive-styles');
    } else {
      this.renderer.removeClass(document.body, 'responsive-styles');
    }
  }

  onCategorySelected(category: Event) {
    const selectedCategory = category as Category; // Assuming Category is the correct type
    this.toggleCategorySelection(selectedCategory);
    // Trigger the categoryFilter method with the selected category

    this.categoryFilter();
    this.isSectionVisible = true;
  }

  onShowSectionChange(value: boolean) {
    if (value === true) {
      this.isSectionVisible = true;
    } else {
      this.isSectionVisible = false;
    }
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
