import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@zodi/libs/orders';
import { ProductsService } from '@zodi/libs/products';
import { UsersService } from '@zodi/libs/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zodi-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: number[] = [];
  endSubs$: Subject<void> = new Subject();

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales(),
    ])
      .pipe(takeUntil(this.endSubs$))
      .subscribe((values) => {
        this.statistics = values;
      });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
