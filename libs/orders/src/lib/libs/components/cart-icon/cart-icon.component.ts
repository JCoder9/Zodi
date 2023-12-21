import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'zodi-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss'],
})
export class CartIconComponent implements OnInit {
  cartCount = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: Cart) => {
      this.cartCount = 0;
      if (cart.items) {
        for (const cartItem of cart.items) {
          if (cartItem.quantity) {
            this.cartCount += cartItem.quantity;
          }
        }
      }
    });
  }
}
