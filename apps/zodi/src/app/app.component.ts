import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { LoadingIndicatorService } from '@zodi/libs/ui';
import { UsersService } from '@zodi/libs/users';

@Component({
  selector: 'zodi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'zodi';
  loading = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        loadingIndicatorService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingIndicatorService.hide();
      }
    });

    loadingIndicatorService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngOnInit(): void {
    this.usersService.initAppSession();
  }
}
