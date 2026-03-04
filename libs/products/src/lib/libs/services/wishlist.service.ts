import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { UsersService, UsersFacade } from '@zodi/libs/users';
import { MatSnackBar } from '@angular/material/snack-bar';

const WISHLIST_KEY = 'wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);
  public wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();
  private currentUserId: string | null = null;
  private isAuthenticated: boolean = false;

  constructor(
    private usersService: UsersService,
    private usersFacade: UsersFacade,
    private snackBar: MatSnackBar
  ) {
    this.initWishlist();
    this.observeAuthState();
  }

  private observeAuthState() {
    combineLatest([
      this.usersFacade.currentUser$,
      this.usersFacade.isAuthenticated$
    ]).subscribe(([user, isAuthenticated]) => {
      const newUserId = user?.id || null;
      const wasAuthenticated = this.isAuthenticated;
      
      this.isAuthenticated = isAuthenticated;
      
      // User logged in - sync localStorage to backend
      if (newUserId && isAuthenticated && !wasAuthenticated) {
        this.syncLocalStorageToBackend(newUserId);
      }
      
      // User changed - reload wishlist
      if (newUserId !== this.currentUserId) {
        this.currentUserId = newUserId;
        this.loadWishlist();
      }
    });
  }

  private initWishlist() {
    this.loadWishlist();
  }

  private loadWishlist() {
    if (this.currentUserId && this.isAuthenticated) {
      // Authenticated user - load from backend
      this.usersService.getUserSavedProducts(this.currentUserId).subscribe({
        next: (products) => {
          this.wishlistSubject.next(products);
          // Update localStorage for offline access
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(products));
        },
        error: () => {
          // Fallback to localStorage if backend fails
          this.loadFromLocalStorage();
        },
      });
    } else {
      // Guest user - load from localStorage
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage() {
    const wishlistJson = localStorage.getItem(WISHLIST_KEY);
    if (wishlistJson) {
      try {
        const wishlist: Product[] = JSON.parse(wishlistJson);
        this.wishlistSubject.next(wishlist);
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        this.wishlistSubject.next([]);
      }
    } else {
      this.wishlistSubject.next([]);
    }
  }

  private syncLocalStorageToBackend(userId: string) {
    const localWishlist = this.getWishlist();
    if (localWishlist.length > 0) {
      // Delay sync by 500ms to ensure token is ready and interceptor is set up
      timer(500).subscribe(() => {
        localWishlist.forEach((product) => {
          if (product.id) {
            this.usersService
              .addSavedProduct(userId, product.id)
              .subscribe({
                next: () => {
                  console.log('Product synced successfully:', product.name);
                },
                error: (err) => {
                  console.error('Error syncing product:', product.name, err);
                },
              });
          }
        });
      });
    }
  }

  getWishlist(): Product[] {
    return this.wishlistSubject.value;
  }

  addToWishlist(product: Product): void {
    if (!product.id) return;

    const currentWishlist = this.getWishlist();
    const existingProduct = currentWishlist.find((p) => p.id === product.id);

    if (!existingProduct) {
      const updatedWishlist = [...currentWishlist, product];
      this.updateWishlist(updatedWishlist);

      // If authenticated, also save to backend
      if (this.currentUserId && this.isAuthenticated) {
        this.usersService
          .addSavedProduct(this.currentUserId, product.id)
          .subscribe({
            next: () => {
              this.snackBar.open('Added to your wishlist!', 'Close', {
                duration: 2000,
              });
            },
            error: (err) => console.error('Error saving to backend:', err),
          });
      } else {
        // Guest user - show confirmation message
        this.snackBar.open(
          'Added to wishlist! Login to sync across devices.',
          'Close',
          {
            duration: 3000,
          }
        );
      }
    }
  }

  removeFromWishlist(productId: string): void {
    const currentWishlist = this.getWishlist();
    const updatedWishlist = currentWishlist.filter(
      (product) => product.id !== productId
    );
    this.updateWishlist(updatedWishlist);

    // If authenticated, also remove from backend
    if (this.currentUserId && this.isAuthenticated) {
      this.usersService
        .removeSavedProduct(this.currentUserId, productId)
        .subscribe({
          next: () => {
            this.snackBar.open('Removed from wishlist', 'Close', {
              duration: 2000,
            });
          },
          error: (err) => console.error('Error removing from backend:', err),
        });
    } else {
      // Guest user - show confirmation message
      this.snackBar.open('Removed from wishlist', 'Close', {
        duration: 2000,
      });
    }
  }

  isInWishlist(productId: string): boolean {
    const currentWishlist = this.getWishlist();
    return currentWishlist.some((product) => product.id === productId);
  }

  toggleWishlist(product: Product): void {
    if (!product.id) return;

    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  clearWishlist(): void {
    this.updateWishlist([]);

    // If authenticated, also clear from backend
    if (this.currentUserId && this.isAuthenticated) {
      const currentWishlist = this.getWishlist();
      currentWishlist.forEach((product) => {
        if (product.id) {
          this.usersService
            .removeSavedProduct(this.currentUserId!, product.id)
            .subscribe();
        }
      });
    }
  }

  getWishlistCount(): Observable<number> {
    return new BehaviorSubject(this.getWishlist().length).asObservable();
  }

  private updateWishlist(wishlist: Product[]): void {
    this.wishlistSubject.next(wishlist);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
}
