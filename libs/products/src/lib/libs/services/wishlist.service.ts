import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

const WISHLIST_KEY = 'wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);
  public wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

  constructor() {
    this.initWishlist();
  }

  private initWishlist() {
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
    }
  }

  removeFromWishlist(productId: string): void {
    const currentWishlist = this.getWishlist();
    const updatedWishlist = currentWishlist.filter(
      (product) => product.id !== productId
    );
    this.updateWishlist(updatedWishlist);
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
  }

  getWishlistCount(): Observable<number> {
    return new BehaviorSubject(this.getWishlist().length).asObservable();
  }

  private updateWishlist(wishlist: Product[]): void {
    this.wishlistSubject.next(wishlist);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
}
