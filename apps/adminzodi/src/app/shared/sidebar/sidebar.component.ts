import { Component } from '@angular/core';
import { AuthService } from '@jrepos/users';

@Component({
    selector: 'adminzodi-sidebar',
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    constructor(private authService: AuthService) {}

    logoutUser() {
        this.authService.logout();
    }
}
