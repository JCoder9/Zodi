import { Component, OnInit } from '@angular/core';
import { CartService } from '@jrepos/orders';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'zodi-messages',
    templateUrl: './messages.component.html',
    styles: [],
})
export class MessagesComponent implements OnInit {
    constructor(
        private cartService: CartService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cartService.cart$.subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Cart Updated!',
                life: 1000,
            });
        });
    }
}
