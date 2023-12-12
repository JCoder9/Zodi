import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Category } from '../../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'zodi-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements AfterViewInit {
  @Input() categories: Category[] = []; // Pass your categories as an input
  showSection = true;
  @ViewChild('sectionDiv') sectionDiv!: ElementRef;
  @ViewChild('productFilter') productFilter!: ElementRef;
  sectionWidth = 0;
  screenWidth = 0;

  @Output() showSectionChange = new EventEmitter<boolean>();

  isHomepage = false;
  isProductsPage = false;
  isCategoryPage = false;

  constructor(private router: Router, private renderer: Renderer2) {
    this.isProductsPage = this.router.url.endsWith('/products');
    this.isCategoryPage = this.router.url.includes('category');
    this.isHomepage = this.router.url === '/';
  }

  ngAfterViewInit() {
    this.checkSectionLayout();

    // Listening to changes in showSectionChange
    this.showSectionChange.subscribe((value: boolean) => {
      if (!value) {
        this.renderer.removeClass(
          this.productFilter.nativeElement,
          'reduce-height'
        );
        this.renderer.addClass(this.productFilter.nativeElement, 'view-height');

        this.renderer.removeClass(
          this.sectionDiv.nativeElement,
          'reduce-height'
        );
        this.renderer.addClass(this.sectionDiv.nativeElement, 'view-height');
      }
    });
  }

  checkSectionLayout() {
    // if (this.sectionDiv.nativeElement.clientWidth) {
    //   this.sectionWidth = this.sectionDiv.nativeElement.clientWidth;
    // }
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 700 && this.isProductsPage) {
      //screen bigger than 700px and product page
      // Apply your class for column layout here
      this.sectionDiv.nativeElement.classList.add('column-layout');
    } else if (this.screenWidth < 700 && this.isProductsPage) {
      this.sectionDiv.nativeElement.classList.add('row-layout');
      this.productFilter.nativeElement.classList.add('reduce-height');
    } else if (this.screenWidth < 700 && !this.isProductsPage) {
      this.sectionDiv.nativeElement.classList.add('column-layout');
    }

    if (
      (this.isHomepage && this.screenWidth > 700) ||
      (this.isProductsPage && this.screenWidth < 700) ||
      (this.isCategoryPage && this.screenWidth < 700)
    ) {
      this.renderer.addClass(this.sectionDiv.nativeElement, 'row-layout');
    } else {
      this.renderer.addClass(this.sectionDiv.nativeElement, 'column-layout');
    }

    if (
      (this.isProductsPage || this.isCategoryPage) &&
      this.screenWidth < 700
    ) {
      this.renderer.removeClass(
        this.productFilter.nativeElement,
        'view-height'
      );
      this.renderer.addClass(this.productFilter.nativeElement, 'reduce-height');

      this.renderer.removeClass(this.sectionDiv.nativeElement, 'view-height');
      this.renderer.addClass(this.sectionDiv.nativeElement, 'reduce-height');
    }
  }

  // Define your click handler for shoe and bag here
  onShoeClick() {
    this.showSection = false;
    this.showSectionChange.emit(this.showSection); // Emitting showSection value

    // Implement your logic for handling the shoe click
  }

  onBagClick() {
    this.showSection = false;
    this.showSectionChange.emit(this.showSection); // Emitting showSection value

    // Implement your logic for handling the bag click
  }
}
