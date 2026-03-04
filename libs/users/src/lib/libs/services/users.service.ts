import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '@env/environment';
import * as countriesLib from 'i18n-iso-countries';
import { UsersFacade } from '../state/users.facade';
declare const require: (arg0: string) => countriesLib.LocaleData;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiURLUsers = environment.apiURL + 'users';

  constructor(private http: HttpClient, private usersFacade: UsersFacade) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/register`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiURLUsers}/${userId}`);
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(
      countriesLib.getNames('en', { select: 'official' })
    ).map((entry) => {
      return {
        id: entry[0],
        name: entry[1],
      };
    });
  }

  getCountry(countryKey: string): string {
    const country = countriesLib.getName(countryKey, 'en');
    if (country) {
      return country;
    }
    return '';
  }

  initAppSession() {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser() {
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuthenticated() {
    return this.usersFacade.isAuthenticated$;
  }

  // Saved Products Methods
  getUserSavedProducts(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLUsers}/${userId}/saved-products`);
  }

  addSavedProduct(userId: string, productId: string): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/${userId}/saved-products`, { productId });
  }

  removeSavedProduct(userId: string, productId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiURLUsers}/${userId}/saved-products/${productId}`);
  }

  // Saved Combos Methods
  getUserSavedCombos(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLUsers}/${userId}/saved-combos`);
  }

  saveCombo(userId: string, combo: { name: string; products: string[] }): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/${userId}/saved-combos`, combo);
  }

  removeCombo(userId: string, comboId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiURLUsers}/${userId}/saved-combos/${comboId}`);
  }
}
