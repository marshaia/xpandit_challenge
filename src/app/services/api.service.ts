import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(){}

  /**
   * List of movies API call. It can receive parameters to filter this list, implement pagination, amongst others.
   * 
   * @param {string[]} params - An array with parameters
   * @returns A Promise of the request response
   */
  getMovies<T>(params: string[]): Promise<T> {
    let url = this.baseUrl + "/movies?" + params.join("&")
    return axios.get(url, {});
  }

  /**
   * Get detailed information about a specific movie. It receives the movie ID and requests its complete info.
   * 
   * @param {string} movie_id - The movie ID 
   * @returns A Promise of the request response
   */
  getMovie<T>(movie_id: string): Promise<T> {
    return axios.get(`${this.baseUrl}/movies/${movie_id}`, {});
  }
}
