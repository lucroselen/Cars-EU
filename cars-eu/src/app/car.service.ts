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
}
