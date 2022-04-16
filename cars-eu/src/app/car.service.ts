import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor(private http: HttpClient) {}
  add$(car: object): Observable<object> {
    return this.http.post<object>(`${environment.apiUrl}/add`, car, {
      withCredentials: true,
    });
  }

  allCars$(): Observable<object> {
    return this.http.get(`${environment.apiUrl}/all-cars`, {
      withCredentials: true,
    });
  }

  top10Cars$(): Observable<object> {
    return this.http.get(`${environment.apiUrl}/top-10`, {
      withCredentials: true,
    });
  }

  getOne$(id: string): Observable<object> {
    return this.http.get(`${environment.apiUrl}/details/${id}`, {
      withCredentials: true,
    });
  }

  delete$(id: string): Observable<object> {
    return this.http.get(`${environment.apiUrl}/delete/${id}`, {
      withCredentials: true,
    });
  }

  voteUp$(id: string): Observable<object> {
    return this.http.get(`${environment.apiUrl}/vote-up/${id}`, {
      withCredentials: true,
    });
  }

  voteDown$(id: string): Observable<object> {
    return this.http.get(`${environment.apiUrl}/vote-down/${id}`, {
      withCredentials: true,
    });
  }

  favorite$(id: string): Observable<object> {
    return this.http.get(`${environment.apiUrl}/favorite/${id}`, {
      withCredentials: true,
    });
  }
}
