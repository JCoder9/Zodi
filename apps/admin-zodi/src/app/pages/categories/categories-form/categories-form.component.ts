import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@zodi/libs/products';
import { MessageService } from 'primeng/api';
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

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff'],
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
    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value,
      color: this.categoryForm['color'].value,
    };

    if (this.editMode) {
      this._updateCategory(category);
    } else {
      this._createCategory(category);
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
          });
      }
    });
  }

  private _updateCategory(category: Category) {
    this.categoriesService
      .updateCategory(category)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category updated!',
          });
          lastValueFrom(timer(2000)).then(() => {
            this.location.back();
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category not updated!',
          });
        },
      });
  }

  private _createCategory(category: Category) {
    this.categoriesService
      .createCategory(category)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (category: Category) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Category ${category.name} created!`,
          });
          lastValueFrom(timer(2000)).then(() => {
            this.location.back();
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category not created!',
          });
        },
      });
  }

  get categoryForm() {
    return this.form.controls;
  }
}
