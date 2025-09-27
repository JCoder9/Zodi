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
    this._getProducts();

    this._getCategories();
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

  onCategorySelected(category: Event) {
    const selectedCategory = category as Category; // Assuming Category is the correct type
    this.toggleCategorySelection(selectedCategory);
    // Trigger the categoryFilter method with the selected category

    this.categoryFilter();
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
