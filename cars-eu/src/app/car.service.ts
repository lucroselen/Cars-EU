import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ICar } from './core/interfaces/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor(private http: HttpClient) {}
  add$(car: ICar): Observable<object> {
    return this.http.post<ICar>(`${environment.apiUrl}/add`, car, {
      withCredentials: true,
    });
  }

  edit$(car: object, id: string): Observable<object> {
    return this.http.post<object>(`${environment.apiUrl}/edit/${id}`, car, {
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

  comment$(id: string, comment: string): Observable<object> {
    return this.http.post<object>(
      `${environment.apiUrl}/comment/${id}`,
      comment,
      {
        withCredentials: true,
      }
    );
  }

  starsGenerator(input: number): string {
    let stars = '';
    if (input >= 1 && input <= 3) {
      stars = '⭐';
    } else if (input >= 4 && input <= 6) {
      stars = '⭐⭐';
    } else if (input >= 7 && input <= 9) {
      stars = '⭐⭐⭐';
    } else if (input >= 10 && input <= 12) {
      stars = '⭐⭐⭐⭐';
    } else if (input >= 13) {
      stars = '⭐⭐⭐⭐⭐';
    }

    return stars;
  }
}
