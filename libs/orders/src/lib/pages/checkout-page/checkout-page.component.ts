import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@jrepos/users';
import { Subject, takeUntil } from 'rxjs';
import { OrderItem } from '../../models/order-item.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { StripeService } from 'ngx-stripe';

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private usersService: UsersService,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private ordersService: OrdersService,
        private stripeService: StripeService
    ) {}
    checkoutFormGroup: FormGroup;
    isSubmitted = false;
    orderItems: OrderItem[] = [];
    userId: string; //guest id as default in this case jordan17
    countries = [];

    endSubs$: Subject<void> = new Subject();

    ngOnInit(): void {
        this._initCheckoutForm();
        this._getCountries();
        this._autoFillUserData();
        this._getCartItems();
    }

    ngOnDestroy(): void {
        this.endSubs$.next();
        this.endSubs$.complete();
    }

    private _initCheckoutForm() {
        this.checkoutFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            phone: [''],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zip: ['', Validators.required],
            apartment: [''],
            street: ['street', Validators.required],
        });
    }

    private _autoFillUserData() {
        this.usersService
            .observeCurrentUser()
            .pipe(takeUntil(this.endSubs$))
            .subscribe((user) => {
                if (user) {
                    this.userId = user.id;
                    this.checkoutForm.name.setValue(user.name);
                    this.checkoutForm.email.setValue(user.email);
                    this.checkoutForm.phone.setValue(user.phone);
                    this.checkoutForm.city.setValue(user.city);
                    this.checkoutForm.country.setValue(
                        this.countries.find(
                            (country) => country.name === user.country
                        ).id
                    );
                    this.checkoutForm.zip.setValue(user.zip);
                    this.checkoutForm.apartment.setValue(user.apartment);
                    this.checkoutForm.street.setValue(user.street);
                }
            });
    }

    private _getCartItems() {
        const cart = this.cartService.getCart();
        this.orderItems = cart.items.map((item) => {
            return {
                product: item.productId,
                quantity: item.quantity,
            };
        });
    }

    private _getCountries() {
        this.countries = this.usersService.getCountries();
    }

    backToCart() {
        this.router.navigate(['/cart']);
    }

    placeOrder() {
        this.isSubmitted = true;
        if (this.checkoutFormGroup.invalid) {
            return;
        }

        const order: Order = {
            orderItems: this.orderItems,
            shippingAddress1: this.checkoutForm.street.value,
            shippingAddress2: this.checkoutForm.apartment.value,
            city: this.checkoutForm.city.value,
            zip: this.checkoutForm.zip.value,
            country: this.checkoutForm.country.value,
            phone: this.checkoutForm.phone.value,
            status: '0',
            user: this.userId,
            dateOrdered: `${Date.now()}`,
        };

        this.ordersService.cacheOrderData(order);

        this.ordersService
            .createCheckoutSession(this.orderItems)
            .subscribe((error) => {
                if (error) {
                    console.log('error in redirect to payment');
                }
            });
    }

    get checkoutForm() {
        return this.checkoutFormGroup.controls;
    }
}
