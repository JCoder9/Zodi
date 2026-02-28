import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

import { SearchComponent } from './components/search/search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { SectionComponent } from './components/section/section.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { MixMatchComponent } from './pages/mix-match/mix-match.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { WishlistIconComponent } from './components/wishlist-icon/wishlist-icon.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { ClearanceComponent } from './pages/clearance/clearance.component';
import { NewInComponent } from './pages/new-in/new-in.component';

import { UiModule } from '@zodi/libs/ui';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { WishlistService } from './services/wishlist.service';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent,
  },
  {
    path: 'category/:categoryid',
    component: ProductsListComponent,
  },
  {
    path: 'products/:productid',
    component: ProductPageComponent,
  },
  {
    path: 'mix-match',
    component: MixMatchComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'brands',
    component: BrandsComponent,
  },
  {
    path: 'clearance',
    component: ClearanceComponent,
  },
  {
    path: 'new-in',
    component: NewInComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UiModule,
  ],
  declarations: [
    SearchComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent,
    SectionComponent,
    ProductFilterComponent,
    MixMatchComponent,
    WishlistComponent,
    WishlistIconComponent,
    BrandsComponent,
    ClearanceComponent,
    NewInComponent,
  ],
  exports: [
    SearchComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent,
    SectionComponent,
    ProductFilterComponent,
    MixMatchComponent,
    WishlistComponent,
    WishlistIconComponent,
    BrandsComponent,
    ClearanceComponent,
    NewInComponent,
  ],
  providers: [WishlistService],
})
export class ProductsModule {}
