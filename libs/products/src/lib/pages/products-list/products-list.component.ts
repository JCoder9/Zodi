import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];
    endSubs$: Subject<void> = new Subject();
    isCategoryPage: boolean;

    constructor(
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
            if (params.categoryid) {
                this._getProducts([params.categoryid]);
                this.isCategoryPage = true;
            } else {
                this._getProducts();
                this.isCategoryPage = false;
            }
        });
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

    categoryFilter() {
        const selectedCategories = this.categories
            .filter((category) => category.checked)
            .map((category) => category.id);

        this._getProducts(selectedCategories);
    }
}
