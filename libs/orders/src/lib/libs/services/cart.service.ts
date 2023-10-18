import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const initCart = {
        items: [],
      };
      const initCartJson = JSON.stringify(initCart);

      localStorage.setItem(CART_KEY, initCartJson);
    } else {
      this.cart$.next(cart);
    }
  }

  emptyCart() {
    const initCart = {
      items: [],
    };
    const initCartJson = JSON.stringify(initCart);

    localStorage.setItem(CART_KEY, initCartJson);
    this.cart$.next(initCart);
  }

  getCart(): Cart {
    const cartJsonString = localStorage.getItem(CART_KEY);
    if (cartJsonString) {
      const cart: Cart = JSON.parse(cartJsonString);
      return cart;
    }
    return {};
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();

    // Ensure that cart.items is an array
    if (!cart.items) {
      cart.items = [];
    }

    const cartItemExist = cart.items.find(
      (item) => item.productId === cartItem.productId
    );

    if (cartItemExist) {
      cart.items.forEach((item) => {
        if (item.productId === cartItem.productId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            if (
              item.quantity !== undefined &&
              cartItem.quantity !== undefined
            ) {
              item.quantity = item.quantity + cartItem.quantity;
            }
          }
        }
      });
    } else {
      cart.items.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string) {
    const cart = this.getCart();
    if (cart && cart.items) {
      const newCartItems = cart.items.filter(
        (item) => item.productId !== productId
      );

      cart.items = newCartItems;

      const cartJsonString = JSON.stringify(cart);
      localStorage.setItem(CART_KEY, cartJsonString);
      this.cart$.next(cart);
    }
  }
}
