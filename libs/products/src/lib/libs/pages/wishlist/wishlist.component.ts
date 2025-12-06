import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'zodi-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getWishlistItems();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getWishlistItems(): void {
    this.wishlistService.wishlist$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((items) => {
        this.wishlistItems = items;
      });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
