import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../models/category.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'zodi-categories-display',
  templateUrl: './categories-display.component.html',
  styleUrls: ['./categories-display.component.scss'],
})
export class CategoriesDisplayComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
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
}
