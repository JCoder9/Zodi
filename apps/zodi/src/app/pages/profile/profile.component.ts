import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UsersService, User, UsersFacade } from '@zodi/libs/users';
import { Product, ProductsService } from '@zodi/libs/products';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SavedCombo {
  name: string;
  products: Product[];
  _id?: string;
  createdAt?: Date;
}

@Component({
  selector: 'zodi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | undefined;
  profileForm!: FormGroup;
  isSubmitted = false;
  savedProducts: Product[] = [];
  savedCombos: SavedCombo[] = [];
  private endSubs$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private usersFacade: UsersFacade,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getUserData();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _initForm(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      street: [''],
      apartment: [''],
      city: [''],
      zip: [''],
      country: [''],
    });
  }

  private _getUserData(): void {
    this.usersFacade.currentUser$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          this._populateForm(user);
          this._loadSavedProducts(user);
          this._loadSavedCombos(user);
        }
      });
  }

  private _populateForm(user: User): void {
    this.profileForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      street: user.street,
      apartment: user.apartment,
      city: user.city,
      zip: user.zip,
      country: user.country,
    });
  }

  private _loadSavedProducts(user: User): void {
    if (user.id) {
      this.usersService
        .getUserSavedProducts(user.id)
        .pipe(takeUntil(this.endSubs$))
        .subscribe((products) => {
          this.savedProducts = products;
        });
    }
  }

  private _loadSavedCombos(user: User): void {
    if (user.id) {
      this.usersService
        .getUserSavedCombos(user.id)
        .pipe(takeUntil(this.endSubs$))
        .subscribe((combos) => {
          this.savedCombos = combos;
        });
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.profileForm.invalid || !this.user?.id) {
      return;
    }

    const updatedUser: User = {
      id: this.user.id,
      ...this.profileForm.value,
    };

    this.usersService
      .updateUser(updatedUser)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open('Error updating profile!', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  removeSavedProduct(productId: string): void {
    if (!this.user?.id) return;

    this.usersService
      .removeSavedProduct(this.user.id, productId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.savedProducts = this.savedProducts.filter(
            (p) => p.id !== productId
          );
          this.snackBar.open('Product removed from favorites!', 'Close', {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open('Error removing product!', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  removeCombo(comboId: string): void {
    if (!this.user?.id) return;

    this.usersService
      .removeCombo(this.user.id, comboId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.savedCombos = this.savedCombos.filter(
            (c) => c._id !== comboId
          );
          this.snackBar.open('Combo removed!', 'Close', {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open('Error removing combo!', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  get profileFormControls() {
    return this.profileForm.controls;
  }
}
