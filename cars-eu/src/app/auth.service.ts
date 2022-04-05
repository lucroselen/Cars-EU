import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from './core/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<IUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: '',
  });

  currentUser$ = this._currentUser.asObservable();
  // isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));

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

  // logout$(): Observable<void> {
  //   return this.httpClient.post<void>(
  //     `${environment.apiUrl}/logout`,
  //     {},
  //     { withCredentials: true }
  //   );
  // }

  register$(userData: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(
      `${environment.apiUrl}/users/register`,
      userData,
      { withCredentials: true }
    );
  }

  // authenticate(): Observable<IUser> {
  //   return this.httpClient
  //     .get<IUser>(`${environment.apiUrl}/users/profile`, {
  //       withCredentials: true,
  //     })
  //     .pipe(
  //       tap((currentProfile) => this.handleLogin(currentProfile)),
  //       catchError((err) => {
  //         return EMPTY;
  //       })
  //     );
  // }

  handleLogin(newUser: IUser) {
    this._currentUser.next(newUser);
  }

  // handleLogout() {
  //   this._currentUser.next(undefined);
  // }
}
