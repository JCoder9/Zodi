import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@jrepos/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adminzodi-orders-detail',
    templateUrl: './orders-detail.component.html',
    styles: [],
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
    order: Order;
    orderStatuses = [];
    selectedStatus: string;
    endSubs$: Subject<void> = new Subject();

    constructor(
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private messageService: MessageService
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
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
            return {
                id: key,
                name: ORDER_STATUS[key].label,
            };
        });
    }

    private _getOrder() {
        this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
            if (params.id) {
                this.ordersService.getOrder(params.id).subscribe((order) => {
                    this.order = order;
                    this.selectedStatus = order.status;
                });
            }
        });
    }

    onStatusChange(event) {
        this.ordersService
            .updateOrder({ status: event.value }, this.order.id)
            .pipe(takeUntil(this.endSubs$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Order Status updated!',
                    });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Order Status not updated!',
                    });
                },
            });
    }
}
