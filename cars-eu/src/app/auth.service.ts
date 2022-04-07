import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from './core/interfaces/user';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<any>(undefined);

  currentUser$ = this._currentUser.asObservable();

  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));

  constructor(private httpClient: HttpClient) {}

  login$(userData: { email: string; password: string }): Observable<IUser> {
    return this.httpClient.post<IUser>(
      `${environment.apiUrl}/users/login`,
      userData,
      {
        withCredentials: true,
      }
    );
  }

  logout$(): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/users/logout`,
      {},
      { withCredentials: true }
    );
  }

  register$(userData: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(
      `${environment.apiUrl}/users/register`,
      userData,
      { withCredentials: true }
    );
  }

  authenticate(): Observable<any> {
    return this.httpClient
      .get(
        `${environment.apiUrl}/users/profile/${localStorage.getItem('id')}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((currentProfile) => {
          this.handleLogin(currentProfile);
        }),
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  handleLogin(newUser: any) {
    let data = { firstName: newUser.firstName, lastName: newUser.lastName };
    this._currentUser.next(data);
  }

  handleLogout() {
    this._currentUser.next(undefined);
  }
}
