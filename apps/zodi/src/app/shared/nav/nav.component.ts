import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface NavItem {
  label: string;
  icon?: string;
  routerLink: string;
  badge?: string;
}

@Component({
  selector: 'zodi-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isMobileMenuOpen = false;
  isMobileView = false;
  isSearchOpen = false;

  navItems: NavItem[] = [
    {
      label: 'Home',
      icon: 'home',
      routerLink: '/',
    },
    {
      label: 'New In',
      icon: 'fiber_new',
      routerLink: '/new-in',
    },
    {
      label: 'Products',
      icon: 'shopping_bag',
      routerLink: '/products',
    },
    {
      label: 'Mix & Match',
      icon: 'palette',
      routerLink: '/mix-match',
    },
    {
      label: 'Brands',
      icon: 'star',
      routerLink: '/brands',
    },
    {
      label: 'Contact',
      icon: 'contact_mail',
      routerLink: '/contact',
    },
  ];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Monitor mobile breakpoint
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobileView = result.matches;
        if (!this.isMobileView) {
          this.isMobileMenuOpen = false;
        }
      });

    // Close mobile menu on route change
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isMobileMenuOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }
}
