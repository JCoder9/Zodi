import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@zodi/libs/products';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'zodi-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId = '';
  endSubs$: Subject<void> = new Subject();
  imageDisplay = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff'],
      image: [''],
    });

    this._checkEditMode();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const categoryFormData = new FormData();
    Object.keys(this.categoryForm).map((key) => {
      categoryFormData.append(key, this.categoryForm[key].value);
    });

    if (this.editMode) {
      this._updateCategory(categoryFormData);
    } else {
      this._createCategory(categoryFormData);
    }
  }

  onCancel() {
    this.location.back();
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentCategoryId = params['id'];
        this.categoriesService
          .getCategory(params['id'])
          .pipe(takeUntil(this.endSubs$))
          .subscribe((category) => {
            this.categoryForm['name'].setValue(category.name);
            this.categoryForm['icon'].setValue(category.icon);
            this.categoryForm['color'].setValue(category.color);
            this.categoryForm['image'].setValue(category.image);
          });
      }
    });
  }

  private _updateCategory(categoryFormData: FormData) {
    this.categoriesService
      .updateCategory(categoryFormData, this.currentCategoryId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.snackBar.open('Category updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          lastValueFrom(timer(2000)).then(() => {
            this.location.back();
          });
        },
        error: () => {
          this.snackBar.open('Error: Category not updated!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
      });
  }

  private _createCategory(categoryFormData: FormData) {
    this.categoriesService
      .createCategory(categoryFormData)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (category: Category) => {
          this.snackBar.open(`Category ${category.name} created successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          lastValueFrom(timer(2000)).then(() => {
            this.location.back();
          });
        },
        error: () => {
          this.snackBar.open('Error: Category not created!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
      });
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const imageControl = this.form.get('image');

    if (file && imageControl) {
      imageControl.patchValue(file);
      imageControl.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as string;
      };
      fileReader.readAsDataURL(file);
    }
  }

  get categoryForm() {
    return this.form.controls;
  }
}
