import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(){}

  getMovies<T>(params: string[]): Promise<T> {
    let url = this.baseUrl + "/movies?" + params.join("&")
    return axios.get(url, {});
  }

  getMovie<T>(movie_id: string): Promise<T> {
    return axios.get(`${this.baseUrl}/movies/${movie_id}`, {});
  }
}
