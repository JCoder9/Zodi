import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'zodi-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Registration failed. Please try again.';
  endSubs$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private localstorageService: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initRegisterForm();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.registerFormGroup.invalid) {
      return;
    }

    const user: User = {
      name: this.registerForm['name'].value,
      email: this.registerForm['email'].value,
      password: this.registerForm['password'].value,
      phone: this.registerForm['phone'].value || '',
      isAdmin: 'false',
      street: '',
      apartment: '',
      zip: '',
      city: '',
      country: '',
    };

    this.usersService
      .createUser(user)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          // After successful registration, log the user in
          this.authService
            .login(user.email!, user.password!)
            .pipe(takeUntil(this.endSubs$))
            .subscribe({
              next: (user) => {
                this.authError = false;
                this.localstorageService.setToken(user.token);
                this.router.navigate(['/']);
              },
              error: () => {
                // Registration succeeded but login failed, redirect to login page
                this.router.navigate(['/login']);
              },
            });
        },
        error: (error: HttpErrorResponse) => {
          this.authError = true;
          if (error.status === 400) {
            this.authMessage = 'Email already exists or invalid data provided.';
          } else {
            this.authMessage = 'Error in the server! Please try again later';
          }
        },
      });
  }

  private _initRegisterForm() {
    this.registerFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: [''],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  get registerForm() {
    return this.registerFormGroup.controls;
  }
}
