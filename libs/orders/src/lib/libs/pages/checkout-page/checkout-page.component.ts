import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@zodi/libs/users';
import { Subject, takeUntil } from 'rxjs';
import { OrderItem } from '../../models/order-item.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { StripeService } from 'ngx-stripe';

@Component({
  selector: 'zodi-checkout-page',
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
  checkoutFormGroup!: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId = ''; //guest id as default in this case jordan17
  countries: any = [];

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
          // Check if user.id is defined before assigning it to this.userId
          if (user.id) {
            this.userId = user.id;
          }

          this.checkoutForm['name'].setValue(user.name);
          this.checkoutForm['email'].setValue(user.email);
          this.checkoutForm['phone'].setValue(user.phone);
          this.checkoutForm['city'].setValue(user.city);
          this.checkoutForm['zip'].setValue(user.zip);
          this.checkoutForm['apartment'].setValue(user.apartment);
          this.checkoutForm['street'].setValue(user.street);

          // Check if `this.countries` is not empty before accessing its properties
          if (this.countries.length > 0) {
            this.checkoutForm['country'].setValue(
              this.countries.find(
                (country: any) => country.name === user.country
              )?.id
            );
          }
        }
      });
  }

  private _getCartItems() {
    const cart = this.cartService.getCart();

    // Check if cart and cart.items are defined before mapping
    if (cart && cart.items) {
      this.orderItems = cart.items.map((item) => {
        return {
          product: item.productId,
          quantity: item.quantity,
        };
      });
    } else {
      // Handle the case when cart or cart.items is undefined
      // For example, you can set this.orderItems to an empty array or handle it as needed.
      this.orderItems = [];
    }
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
      shippingAddress1: this.checkoutForm['street'].value,
      shippingAddress2: this.checkoutForm['apartment'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: this.checkoutForm['phone'].value,
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
