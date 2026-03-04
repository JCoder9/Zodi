import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LocalstorageService, AuthService } from '@zodi/libs/users';

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
  isUserLoggedIn = false;

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
    private breakpointObserver: BreakpointObserver,
    private localstorageService: LocalstorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this._checkAuthStatus();

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
        this._checkAuthStatus(); // Re-check auth on route changes
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _checkAuthStatus(): void {
    this.isUserLoggedIn = this.localstorageService.isValidToken();
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onLogout(): void {
    this.authService.logout();
    this.isUserLoggedIn = false;
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
