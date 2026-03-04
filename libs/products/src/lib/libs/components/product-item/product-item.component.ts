import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, take } from 'rxjs';
import { CartItem, CartService } from '@zodi/libs/orders';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';
import { UsersService, UsersFacade } from '@zodi/libs/users';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'zodi-product-item',
  templateUrl: './product-item.component.html',
  styles: [
    `
      .product-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-width: 100%;
        overflow: hidden;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        cursor: pointer;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      .product-image-container {
        position: relative;
        width: 100%;
        height: 250px;
        overflow: hidden;
        background: #f5f5f5;
      }

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .product-image:hover {
        transform: scale(1.05);
      }

      .wishlist-button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        width: 40px;
        height: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .wishlist-button.wishlist-active {
        background: rgba(255, 255, 255, 0.95);
      }

      .product-badges {
        position: absolute;
        top: 8px;
        left: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        z-index: 1;
      }

      .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .sale-badge {
        background: #ff5722;
        color: white;
      }

      .clearance-badge {
        background: #f44336;
        color: white;
      }

      .discount-badge {
        background: #4caf50;
        color: white;
      }

      mat-card-content {
        flex: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .product-name {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.3;
        color: #333;
        text-decoration: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }

      .product-name:hover {
        color: #1976d2;
      }

      .product-brand {
        margin: 0;
        font-size: 14px;
        color: #666;
        font-weight: 400;
      }

      .product-price {
        margin-top: auto;
      }

      .price-container {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .price-amount {
        font-size: 18px;
        font-weight: 600;
        color: #2c5aa0;
      }

      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        font-weight: 400;
      }

      mat-card-actions {
        padding: 8px 16px 16px 16px;
        margin: 0;
      }

      .add-to-cart-button {
        width: 100%;
        height: 40px;
        font-size: 14px;
        font-weight: 500;
      }

      /* Responsive adjustments */
      @media (max-width: 1200px) {
        .product-image-container {
          height: 220px;
        }

        .product-name {
          font-size: 15px;
        }

        .price-amount {
          font-size: 16px;
        }
      }

      @media (max-width: 768px) {
        .product-image-container {
          height: 180px;
        }

        mat-card-content {
          padding: 12px;
          gap: 6px;
        }

        .product-name {
          font-size: 14px;
        }

        .product-brand {
          font-size: 13px;
        }

        .price-amount {
          font-size: 15px;
        }

        .add-to-cart-button {
          height: 36px;
          font-size: 13px;
        }

        mat-card-actions {
          padding: 6px 12px 12px 12px;
        }
      }

      @media (max-width: 480px) {
        .product-image-container {
          height: 160px;
        }

        .wishlist-button {
          width: 36px;
          height: 36px;
          top: 6px;
          right: 6px;
        }
      }
    `,
  ],
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  endSubs$: Subject<void> = new Subject();
  isInWishlist = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private usersService: UsersService,
    private usersFacade: UsersFacade,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((items) => {
        this.isInWishlist = items.some(
          (item) => item.id === this.product.id && this.product.id
        );
      });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1,
    };
    this.cartService.setCartItem(cartItem);
  }

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.product.id) return;

    const wasInWishlist = this.isInWishlist;

    // Toggle in wishlist service for immediate UI feedback
    if (wasInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }

    // Save to user's profile if logged in
    this.usersFacade.isAuthenticated$
      .pipe(take(1))
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated || !this.product.id) {
          return;
        }

        this.usersFacade.currentUser$
          .pipe(take(1))
          .subscribe((user) => {
            if (!user?.id || !this.product.id) {
              return;
            }

            if (wasInWishlist) {
              // Remove from user's saved products
              this.usersService
                .removeSavedProduct(user.id, this.product.id!)
                .subscribe({
                  next: () => {
                    this.snackBar.open('Removed from favorites', 'Close', {
                      duration: 2000,
                    });
                  },
                  error: () => {
                    // Revert wishlist change on error
                    this.wishlistService.addToWishlist(this.product);
                  },
                });
            } else {
              // Add to user's saved products
              this.usersService
                .addSavedProduct(user.id, this.product.id!)
                .subscribe({
                  next: () => {
                    this.snackBar.open('Added to favorites!', 'Close', {
                      duration: 2000,
                    });
                  },
                  error: () => {
                    // Revert wishlist change on error
                    this.wishlistService.removeFromWishlist(this.product.id!);
                  },
                });
            }
          });
      });
  }
}
