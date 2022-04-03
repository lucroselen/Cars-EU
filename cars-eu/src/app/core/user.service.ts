import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from './interfaces/user';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getProfile$(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${environment.apiUrl}/users/profile`, {
      withCredentials: true,
    });
  }
}
