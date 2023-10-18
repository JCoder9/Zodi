import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@zodi/libs/orders';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'zodi-product-page',
  templateUrl: './product-page.component.html',
  styles: [],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  product!: Product;
  quantity = 1;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if (params['productid']) {
        this._getProduct(params['productid']);
      }
    });
  }
  private _getProduct(productid: string) {
    this.productsService
      .getProduct(productid)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((product) => {
        this.product = product;
      });
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity,
    };
    this.cartService.setCartItem(cartItem);
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
