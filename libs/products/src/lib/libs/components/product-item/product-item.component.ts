import { Component, Input } from '@angular/core';
import { CartItem, CartService } from '@zodi/libs/orders';
import { Product } from '../../models/product.model';

@Component({
  selector: 'zodi-product-item',
  templateUrl: './product-item.component.html',
  styles: [],
})
export class ProductItemComponent {
  @Input() product!: Product;
  constructor(private cartService: CartService) {}

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1,
    };
    this.cartService.setCartItem(cartItem);
  }
}
