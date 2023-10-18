import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'zodi-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email or Password are incorrect!';
  endSubs$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localstorageService: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initLoginForm();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginFormGroup.invalid) {
      return;
    }
    const loginData = {
      email: this.loginForm['email'].value,
      password: this.loginForm['password'].value,
    };
    this.authService
      .login(loginData.email, loginData.password)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (user) => {
          this.authError = false;
          this.localstorageService.setToken(user.token);
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this.authError = true;
          if (error.status !== 400) {
            this.authMessage = 'Error in the server! Please try again later';
          }
        },
      });
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get loginForm() {
    return this.loginFormGroup.controls; //better to not have this long sentence in html
  }
}
