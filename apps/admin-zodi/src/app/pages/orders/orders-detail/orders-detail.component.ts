import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Order,
  OrdersService,
  OrderStatus,
  ORDER_STATUS,
} from '@zodi/libs/orders';
import { Product, ProductsService } from '@zodi/libs/products';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zodi-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [],
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order!: Order;
  orderStatuses: any;
  selectedStatus!: string;
  endSubs$: Subject<void> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _mapOrderStatus() {
    const statusMap: OrderStatus = ORDER_STATUS;
    Object.keys(statusMap).forEach((key) => {
      this.orderStatuses[key] = {
        label: statusMap[key].label,
        color: statusMap[key].color,
      };
    });
  }

  private _getOrder() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if (params['id']) {
        this.ordersService.getOrder(params['id']).subscribe((order) => {
          this.order = order;
          this.selectedStatus = order.status || ''; // Assign an empty string if `order.status` is undefined
        });
      }
    });
  }

  private _loadProduct(productId: string): Observable<Product> {
    return this.productsService.getProduct(productId);
  }

  loadProduct(productId: string) {
    return this._loadProduct(productId) || {};
  }

  onStatusChange(event: any) {
    // Extract the selected value from the event object
    const selectedValue: string = event.value;

    // Update the selectedStatus property
    this.selectedStatus = selectedValue;

    // Update the order status via your service
    this.ordersService
      .updateOrder({ status: selectedValue }, this.order.id || '')
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.snackBar.open('Order status updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        error: () => {
          this.snackBar.open('Error: Order status not updated!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  // Add a helper function to check for null or undefined
  isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }
}
