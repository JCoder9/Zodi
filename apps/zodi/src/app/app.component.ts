import { Component, OnInit } from '@angular/core';
import { UsersService } from '@jrepos/users';

@Component({
    selector: 'zodi-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    title = 'zodi';
    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this.usersService.initAppSession();
    }
}
