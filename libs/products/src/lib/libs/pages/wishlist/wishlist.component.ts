import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';
import { ProductsService } from '../../services/products.service';

interface SavedCombo {
  name: string;
  products: string[]; // Product IDs
  _id?: string;
  createdAt?: Date;
}

interface SavedComboWithProducts {
  name: string;
  products: Product[];
  _id?: string;
  createdAt?: Date;
}

const SAVED_COMBOS_KEY = 'savedCombos';

@Component({
  selector: 'zodi-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  wishlistItems: Product[] = [];
  savedCombos: SavedComboWithProducts[] = [];

  constructor(
    private wishlistService: WishlistService,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getWishlistItems();
    this._loadSavedCombos();
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

  private _loadSavedCombos(): void {
    try {
      const localCombosJson = localStorage.getItem(SAVED_COMBOS_KEY);
      if (localCombosJson) {
        const localCombos: SavedCombo[] = JSON.parse(localCombosJson);
        
        // Fetch all products to resolve combo product IDs
        this.productsService
          .getProducts()
          .pipe(takeUntil(this.endSubs$))
          .subscribe((allProducts) => {
            this.savedCombos = localCombos.map((combo) => {
              const products = combo.products
                .map((productId) =>
                  allProducts.find((p) => p.id === productId)
                )
                .filter((p): p is Product => p !== undefined);
              
              return {
                name: combo.name,
                products: products,
                _id: combo._id,
                createdAt: combo.createdAt,
              };
            });
          });
      }
    } catch (error) {
      console.error('Error loading saved combos:', error);
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  removeCombo(index: number): void {
    try {
      const localCombosJson = localStorage.getItem(SAVED_COMBOS_KEY);
      if (localCombosJson) {
        const localCombos: SavedCombo[] = JSON.parse(localCombosJson);
        localCombos.splice(index, 1);
        localStorage.setItem(SAVED_COMBOS_KEY, JSON.stringify(localCombos));
        this.savedCombos.splice(index, 1);
      }
    } catch (error) {
      console.error('Error removing combo:', error);
    }
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  clearCombos(): void {
    localStorage.removeItem(SAVED_COMBOS_KEY);
    this.savedCombos = [];
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
