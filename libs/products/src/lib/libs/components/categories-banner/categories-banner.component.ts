import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'zodi-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [],
})
export class CategoriesBannerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() categories: Category[] = [];
  @Output() categorySelected: EventEmitter<Category> = new EventEmitter();
  @ViewChild('categoriesContainer') catContainerDiv!: ElementRef;
  @ViewChild('categoryImage') categoryImageDiv!: ElementRef;
  catContainerWidth = 0;

  endSubs$: Subject<void> = new Subject();

  constructor(private categoriesService: CategoriesService) {}
  ngOnDestroy() {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  ngOnInit(): void {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  onCategorySelected(category: Category) {
    this.categorySelected.emit(category);
  }

  getMaterialIcon(primeIcon?: string): string {
    const iconMap: { [key: string]: string } = {
      tshirt: 'checkroom',
      female: 'person',
      male: 'person_outline',
      briefcase: 'business_center',
      crown: 'workspace_premium',
      heart: 'favorite',
      star: 'star',
      tag: 'local_offer',
      gift: 'card_giftcard',
      home: 'home',
      'shopping-bag': 'shopping_bag',
      palette: 'palette',
      phone: 'phone',
      envelope: 'email',
      user: 'person',
      search: 'search',
      plus: 'add',
      minus: 'remove',
      check: 'check',
      times: 'close',
      'chevron-right': 'chevron_right',
      'chevron-left': 'chevron_left',
      'angle-right': 'keyboard_arrow_right',
      'angle-left': 'keyboard_arrow_left',
    };

    return iconMap[primeIcon || ''] || 'category';
  }

  ngAfterViewInit() {
    this.checkSectionWidth();
  }

  checkSectionWidth() {
    if (this.catContainerDiv.nativeElement.clientWidth) {
      this.catContainerWidth = this.catContainerDiv.nativeElement.clientWidth;
    }
    if (this.catContainerWidth < 700) {
      // Apply your class for column layout here
      // this.categoryImageDiv.nativeElement.classList.add(
      //   'hide-category-type-image'
      // );
    }
  }
}
