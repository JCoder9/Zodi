import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@jrepos/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adminzodi-products-list',
    templateUrl: './products-list.component.html',
    styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products = [];
    endSubs$: Subject<void> = new Subject();

    constructor(
        private productsService: ProductsService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this._getProducts();
    }

    ngOnDestroy(): void {
        this.endSubs$.next();
        this.endSubs$.complete();
    }

    updateProduct(productId: string) {
        this.router.navigateByUrl(`products/form/${productId}`);
    }

    deleteProduct(productId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productsService
                    .deleteProduct(productId)
                    .pipe(takeUntil(this.endSubs$))
                    .subscribe({
                        next: () => {
                            this._getProducts();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Product deleted!',
                            });
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Product not deleted!',
                            });
                        },
                    });
            },
        });
    }

    private _getProducts() {
        this.productsService
            .getProducts()
            .pipe(takeUntil(this.endSubs$))
            .subscribe((products) => {
                this.products = products;
            });
    }
}
