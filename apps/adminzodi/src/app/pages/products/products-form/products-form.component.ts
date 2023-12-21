import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@jrepos/products';
import { MessageService } from 'primeng/api';
import { lastValueFrom, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adminzodi-products-form',
    templateUrl: './products-form.component.html',
    styles: [],
})
export class ProductsFormComponent implements OnInit, OnDestroy {
    editMode = false;
    form: FormGroup;
    isSubmitted = false;
    categories = [];
    imageDisplay: string | ArrayBuffer;
    currentProductId: string;
    endSubs$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private productsService: ProductsService,
        private messageService: MessageService,
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
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} created!`,
                    });
                    lastValueFrom(timer(2000)).then(() => {
                        this.location.back();
                    });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product not created!',
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
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Product updated!',
                    });
                    lastValueFrom(timer(2000)).then(() => {
                        this.location.back();
                    });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product not updated!',
                    });
                },
            });
    }

    private _checkEditMode() {
        this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
            if (params.id) {
                this.editMode = true;
                this.currentProductId = params.id;
                this.productsService
                    .getProduct(params.id)
                    .pipe(takeUntil(this.endSubs$))
                    .subscribe((product) => {
                        this.productForm.name.setValue(product.name);
                        this.productForm.description.setValue(
                            product.description
                        );
                        this.productForm.richDescription.setValue(
                            product.richDescription
                        );
                        this.productForm.brand.setValue(product.brand);
                        this.productForm.price.setValue(product.price);
                        this.productForm.category.setValue(product.category.id);
                        this.productForm.countInStock.setValue(
                            product.countInStock
                        );
                        this.productForm.isFeatured.setValue(
                            product.isFeatured
                        );
                        this.imageDisplay = product.image;
                        this.productForm.image.setValidators([]);
                        this.productForm.image.updateValueAndValidity();
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

    onImageUpload(event) {
        const file = event.target.files[0];

        if (file) {
            this.form.patchValue({ image: file });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    get productForm() {
        return this.form.controls;
    }
}
