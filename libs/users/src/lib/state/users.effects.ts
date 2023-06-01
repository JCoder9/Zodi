import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { LocalstorageService } from '../services/localstorage.service';
import { UsersService } from '../services/users.service';

import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
    constructor(
        private readonly actions$: Actions,
        private localStorageService: LocalstorageService,
        private usersService: UsersService
    ) {}

    buildUserSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.buildUserSession),
            concatMap(() => {
                if (this.localStorageService.isValidToken()) {
                    const userId =
                        this.localStorageService.getUserIdFromToken();
                    if (userId) {
                        return this.usersService.getUser(userId).pipe(
                            map((user) => {
                                return UsersActions.buildUserSessionSuccess({
                                    user: user,
                                });
                            }),
                            catchError(() =>
                                of(UsersActions.buildUserSessionFailed())
                            )
                        );
                    } else {
                        return of(UsersActions.buildUserSessionFailed());
                    }
                } else {
                    return of(UsersActions.buildUserSessionFailed());
                }
            })
        )
    );
}
