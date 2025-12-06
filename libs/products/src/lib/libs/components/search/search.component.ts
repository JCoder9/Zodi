import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  fromEvent,
} from 'rxjs';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchResult } from '../../models/search-result.model';

@Component({
  selector: 'zodi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchResults: SearchResult[] = [];
  searchQuery = '';
  isSearchOpen = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService, private router: Router) {
    // Listen to search input changes
    this.searchSubject
      .pipe(
        debounceTime(300), // wait 300ms after user stops typing
        distinctUntilChanged(),
        switchMap((query) => {
          this.searchQuery = query;
          return query.length > 0 ? this.searchService.search(query) : [];
        })
      )
      .subscribe((results) => {
        this.searchResults = results;
        this.isSearchOpen = this.searchQuery.length > 0;
      });
  }

  ngOnInit() {
    // Close dropdown when clicking outside
    fromEvent(document, 'click').subscribe((event: Event) => {
      const target = event.target as HTMLElement;
      if (target && !target.closest('.search-container')) {
        this.closeSearch();
      }
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onSearchFocus() {
    if (this.searchQuery.length > 0) {
      this.isSearchOpen = true;
    }
  }

  onSearchBlur() {
    // Delay to allow click on results
    setTimeout(() => {
      this.isSearchOpen = false;
    }, 200);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearchOpen = false;
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  trackByResult(index: number, result: SearchResult): any {
    return result.name;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      brand: 'Brand',
      category: 'Category',
      color: 'Color',
    };
    return labels[type] || type;
  }

  onResultClick(result: SearchResult) {
    if (result.type === 'product' && result.id) {
      this.router.navigate(['/products', result.id]);
    } else if (result.type === 'brand') {
      this.router.navigate(['/products'], {
        queryParams: { brand: result.name },
      });
    } else if (result.type === 'category') {
      this.router.navigate(['/products'], {
        queryParams: { category: result.name },
      });
    } else if (result.type === 'color') {
      this.router.navigate(['/products'], {
        queryParams: { color: result.name },
      });
    }

    // Clear search results after selection
    this.closeSearch();
    this.clearSearch();
  }

  // Material autocomplete display function
  displayFn(result: SearchResult): string {
    return result ? result.name : '';
  }

  // Get badge color for result type
  getBadgeColor(type: string): string {
    switch (type) {
      case 'product':
        return 'primary';
      case 'brand':
        return 'accent';
      case 'category':
        return 'warn';
      default:
        return 'primary';
    }
  }
}
