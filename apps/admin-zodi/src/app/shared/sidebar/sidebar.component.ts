import { Component } from '@angular/core';
import { AuthService } from '@zodi/libs/users';

@Component({
  selector: 'zodi-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logoutUser() {
    this.authService.logout();
  }
}
