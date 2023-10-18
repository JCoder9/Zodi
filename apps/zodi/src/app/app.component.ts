import { Component, OnInit } from '@angular/core';
import { UsersService } from '@zodi/libs/users';

@Component({
  selector: 'zodi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'zodi';
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.initAppSession();
  }
}
