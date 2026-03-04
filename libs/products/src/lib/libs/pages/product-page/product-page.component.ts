import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem, CartService } from '@zodi/libs/orders';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'zodi-product-page',
  templateUrl: './product-page.component.html',
  styles: [
    `
      .product-brand {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 12px;
      }

      .product-details {
        margin: 24px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .detail-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        font-size: 0.95rem;
      }

      .detail-row:last-child {
        margin-bottom: 0;
      }

      .detail-row strong {
        min-width: 120px;
        color: #333;
      }

      .size-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .size-badge {
        display: inline-block;
        padding: 4px 12px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .stock-status .in-stock {
        color: #28a745;
        font-weight: 600;
      }

      .stock-status .out-of-stock {
        color: #dc3545;
        font-weight: 600;
      }

      .stock-count {
        color: #666;
        font-size: 0.85rem;
        margin-left: 8px;
      }

      .price-before {
        text-decoration: line-through;
        color: #999;
        margin-left: 12px;
        font-size: 0.9em;
      }
    `,
  ],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  product!: Product;
  quantity = 1;
  productImages: string[] = [];

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar
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
        this._prepareImages();
      });
  }

  private _prepareImages() {
    // Combine main image and additional images for gallery
    this.productImages = [];
    
    if (this.product.image) {
      this.productImages.push(this.product.image);
    }
    
    if (this.product.images && this.product.images.length > 0) {
      this.productImages = [...this.productImages, ...this.product.images];
    }
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity,
    };
    this.cartService.setCartItem(cartItem);
    
    this.snackBar.open(
      `${this.product.name} added to cart!`,
      'View Cart',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
  }

  increaseQuantity() {
    if (this.quantity < 100) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
