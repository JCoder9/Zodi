import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Order, OrdersService, ORDER_STATUS } from '@zodi/libs/orders';
import { UsersFacade } from '@zodi/libs/users';
import { ProductsService } from '@zodi/libs/products';

@Component({
  selector: 'zodi-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  orderStatuses = ORDER_STATUS;
  isLoading = true;
  private endSubs$ = new Subject<void>();

  constructor(
    private ordersService: OrdersService,
    private usersFacade: UsersFacade,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this._getUserOrders();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getUserOrders(): void {
    this.usersFacade.currentUser$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((user) => {
        if (user?.id) {
          this.ordersService
            .getUserOrders(user.id)
            .pipe(takeUntil(this.endSubs$))
            .subscribe({
              next: (orders) => {
                this._loadProductsForOrders(orders);
              },
              error: () => {
                this.isLoading = false;
              },
            });
        }
      });
  }

  private _loadProductsForOrders(orders: Order[]): void {
    const productRequests = orders.flatMap((order) => 
      (order.orderItems || []).map((item) => 
        this.productsService.getProduct(item.productId!)
      )
    );

    if (productRequests.length === 0) {
      this.orders = orders;
      this.isLoading = false;
      return;
    }

    forkJoin(productRequests)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (products) => {
          let productIndex = 0;
          orders.forEach((order) => {
            order.orderItems?.forEach((item) => {
              item.product = products[productIndex++];
            });
          });
          this.orders = orders;
          this.isLoading = false;
        },
        error: () => {
          this.orders = orders;
          this.isLoading = false;
        },
      });
  }

  getStatusInfo(status: string) {
    const statusKey = status as keyof typeof ORDER_STATUS;
    return this.orderStatuses[statusKey] || { label: 'Unknown', color: 'secondary' };
  }

  getTotalItems(order: Order): number {
    return order.orderItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  }
}
