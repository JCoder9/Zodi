import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MessagesComponent } from './shared/messages/messages.component';

import { UiModule } from '@zodi/libs/ui';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@zodi/libs/products';
import { TestingModule } from '@zodi/libs/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersModule } from '@zodi/libs/orders';
import { JwtInterceptor, UsersModule } from '@zodi/libs/users';
import { ErrorInterceptor } from '@zodi/libs/users';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgxStripeModule } from 'ngx-stripe';
import { TestingComponent } from './pages/testing/testing.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MaterialModule } from './shared/material/material.module';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'testing', component: TestingComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MessagesComponent,
    TestingComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    UiModule,
    ProductsModule,
    TestingModule,
    OrdersModule,
    UsersModule,
    provideFirebaseApp(() => initializeApp({})),
    provideFirestore(() => getFirestore()),

    NgxStripeModule.forRoot(
      'pk_test_51LNGHcCT1CiSMWZ7U1neRYnXdZnIlUtU1xPtNgTf4iCzc1QJcXU051AzVjoALw53LGsCOkRjmQ1M8zYvH9BSAhah00VSq3MsMy'
    ),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [ContactComponent],
})
export class AppModule {}
