import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@zodi/libs/products';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'zodi-products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endSubs$: Subject<void> = new Subject();

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: 'Do you want to delete this product?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productsService
          .deleteProduct(productId)
          .pipe(takeUntil(this.endSubs$))
          .subscribe({
            next: () => {
              this._getProducts();
              this.snackBar.open('Product deleted!', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
            },
            error: () => {
              this.snackBar.open('Error deleting product', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar'],
              });
            },
          });
      }
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
