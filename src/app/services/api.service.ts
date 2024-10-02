import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getMovies<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/movies`);
  }

  getMovie<T>(movie_id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/movies/${movie_id}`);
  }
  
}
