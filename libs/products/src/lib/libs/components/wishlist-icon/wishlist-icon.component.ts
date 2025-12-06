import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'zodi-wishlist-icon',
  template: `
    <button
      mat-icon-button
      routerLink="/wishlist"
      class="wishlist-icon-button"
      [matBadge]="wishlistCount"
      [matBadgeHidden]="wishlistCount <= 0"
      matBadgeColor="warn"
      matBadgeSize="small"
    >
      <mat-icon [class.filled]="wishlistCount > 0">
        {{ wishlistCount > 0 ? 'favorite' : 'favorite_border' }}
      </mat-icon>
    </button>
  `,
  styles: [
    `
      .mat-icon-button {
        position: relative;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        mat-icon {
          font-size: 1.5rem;
          height: 1.5rem;
          width: 1.5rem;
          color: rgba(0, 0, 0, 0.54);
          transition: color 0.3s ease;

          &.filled {
            color: #ff6b6b !important;
          }
        }
      }
    `,
  ],
})
export class WishlistIconComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  wishlistCount = 0;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((items) => {
        this.wishlistCount = items.length;
      });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
