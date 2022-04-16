import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getProfile$(): Observable<object> {
    return this.httpClient.get(
      `${environment.apiUrl}/users/profile/${localStorage.getItem('id')}`,
      {
        withCredentials: true,
      }
    );
  }
}
