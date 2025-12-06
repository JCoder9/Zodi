import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService, Order, ORDER_STATUS } from '@zodi/libs/orders';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zodi-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  orderStatus: any = ORDER_STATUS;
  endSubs$: Subject<void> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._getOrders();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getOrders() {
    this.ordersService
      .getOrders()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService
          .deleteOrder(orderId)
          .pipe(takeUntil(this.endSubs$))
          .subscribe({
            next: () => {
              this._getOrders();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order deleted!',
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Order not deleted!',
              });
            },
          });
      },
    });
  }
}
