import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CategoriesService,
  Category,
  Product,
  ProductsService,
} from '@zodi/libs/products';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zodi-products-form',
  templateUrl: './products-form.component.html',
  styles: [],
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form!: FormGroup;
  isSubmitted = false;
  categories: Category[] = [];

  imageDisplay!: string | ArrayBuffer;
  currentProductId = '';
  endSubs$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getCategories();

    this._checkEditMode();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }
    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });

    if (this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._createProduct(productFormData);
    }
  }

  private _createProduct(productData: FormData) {
    this.productsService
      .createProduct(productData)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (product: Product) => {
          this.snackBar.open(
            `Product ${product.name} created successfully!`,
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
            }
          );
          lastValueFrom(timer(2000)).then(() => {
            this.location.back();
          });
        },
        error: () => {
          this.snackBar.open('Error: Product not created!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  private _updateProduct(productData: FormData) {
    this.productsService
      .updateProduct(productData, this.currentProductId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: () => {
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          lastValueFrom(timer(2000)).then(() => {
            this.location.back();
          });
        },
        error: () => {
          this.snackBar.open('Error: Product not updated!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentProductId = params['id'];
        this.productsService
          .getProduct(params['id'])
          .pipe(takeUntil(this.endSubs$))
          .subscribe((product) => {
            this.productForm['name'].setValue(product.name);
            this.productForm['description'].setValue(product.description);
            this.productForm['richDescription'].setValue(
              product.richDescription
            );
            this.productForm['brand'].setValue(product.brand);
            this.productForm['price'].setValue(product.price);
            if (product.category !== undefined) {
              this.productForm['category'].setValue(product.category.id);
            } else {
              // Handle the case where product.category is undefined
              // You can assign a default category ID or handle it according to your application logic.
              this.productForm['category'].setValue('default-category-id'); // Example default category ID
            }

            this.productForm['countInStock'].setValue(product.countInStock);
            this.productForm['isFeatured'].setValue(product.isFeatured);

            // Conditional check for product.image
            if (product.image !== undefined) {
              this.imageDisplay = product.image as string;
            } else {
              // Handle the case where product.image is undefined
              // You can assign a default image or handle it according to your application logic.
              this.imageDisplay = 'images/missing.jpg'; // Example default image file
            }

            this.productForm['image'].setValidators([]);
            this.productForm['image'].updateValueAndValidity();
          });
      }
    });
  }

  onCancel() {
    this.location.back();
  }

  _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      isFeatured: [false],
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

  get productForm() {
    return this.form.controls;
  }
}
