import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';
import { MovieFiltersComponent } from '../movie-filters/movie-filters.component';
import { ApiService } from '../../services/api.service';
import { PageMovie } from '../../models/page-movie.model';
import { Movie } from '../../models/movie.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  providers: [ApiService],
  imports: [CommonModule, FontAwesomeModule, MovieModalComponent, MovieFiltersComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  faEye = faEye;
  
  page = 0;       // current page of the API request (pagination)
  page_size = 10; // page size of API request (pagination)
  loading = false;
  has_any_filter_active = false;

  showModal = false;
  movie_id: string | null = null;
  
  hasMoreMoviesToFetch = true;
  movies: Movie[] = [];


  /**
   * @constructor
   * @param {ApiService} apiService 
   */
  constructor(private apiService: ApiService) {}

  /**
   * Fetches movies from the backend. 
   */
  ngOnInit(): void {
    this.fetchMovies();
  }

  /**
   * Function that fetches movies.
   * It has into account pagination (page and page_size variables).
   * When it's first loaded, it fetches movies until the user's screen is full.
   * 
   * In case of error, it sends a window alert.
   */
  fetchMovies(): void {  
    this.loading = true;
    this.apiService.getMovies<{data: PageMovie}>([`page=${this.page}`, `size=${this.page_size}`])
      .then(response => { 
        this.loading = false;
        this.page += 1;
        this.hasMoreMoviesToFetch = !response.data.last;
        this.movies = this.movies.concat(response.data.content);

        if (this.hasMoreMoviesToFetch) this.checkIfNeedMoreMovies();
      })
      .catch(() => { 
        this.loading = false;
        window.alert("Error fetching movies. Please try again!") 
      });
  }

  /**
   * Helper function to fetch movies (when the page first loads) until the user's screen is full.
   */
  checkIfNeedMoreMovies(): void {
    const movieTableHeight = this.movies.length * 48; // Approximate height per movie row
    const viewportHeight = window.innerHeight;

    // Fetch more movies if the table height is less than the viewport height
    if (movieTableHeight < viewportHeight) {
      this.fetchMovies(); 
    }
  }

  /**
   * Scroll Listener.
   * It detects the scroll to the bottom of the page and automatically fetches more movies.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.has_any_filter_active && this.hasMoreMoviesToFetch) {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      // Fetch more movies when reaching the bottom
      if (scrollPosition >= pageHeight && !this.loading) {
        this.fetchMovies(); 
      }
    }
    
  }

  /**
   * Function to handle the emits from the Movie Filters component.
   * It resets the pagination, and fetches movies accordingly.
   * 
   * @param {{type: string, year?: number}} $event 
   */
  filter_movies($event: {type: string, year?: number}): void {
    this.page = 0;
    this.movies = [];
    this.hasMoreMoviesToFetch = true;

    switch ($event.type) {
      case 'null': // No filter
        this.has_any_filter_active = false;
        this.fetchMovies();
        break;
      case 'top': // Top 10 Revenue Filter
        this.has_any_filter_active = true;
        this.fetch_top_10_revenue(false);
        break;
      case 'top_year': // Top 10 Revenue per Year Filter
        this.has_any_filter_active = true;
        this.fetch_top_10_revenue(true, $event.year ?? 0);
        break;
      default:
        break;
    }
  }

  /**
   * Function that, depending on the arguments, fetches all movies or all movies from a given year.
   * 
   * @param {boolean} by_year - If true it's 'Top 10 Revenue per Year' filter, else it's 'Top 10 Revenue' filter. 
   * @param {number} year - Optional parameter. Only exists if @by_year is true.
   */
  fetch_top_10_revenue(by_year: boolean, year?: number) {
    const params = by_year ? [`start=${year}`, `end=${year}`] : [];
    this.loading = true;

    this.apiService.getMovies<{data: PageMovie}>(params)
      .then(response => { 
        this.loading = false;
        this.movies = this.get_top_movies(10, response.data.content);
      })
      .catch(() => { 
        this.loading = false;
        window.alert("Error fetching Top 10 Revenue "+ (by_year ?? "per Year") +". Please try again!") 
      });
  }

  /**
   * Helper function to the `fetch_top_10_revenue`.
   * It receives a movie list and returns the top N movies by revenue.
   * 
   * @param {number} top_size - Top N size
   * @param {Movie[]} movies - Movies list
   * @returns Top N Movies by Revenue
   */
  get_top_movies(top_size: number, movies: Movie[]): Movie[] {
    const sorted = [...movies].sort((a, b) => b.revenue - a.revenue);
    return sorted.slice(0, top_size);
  }

  /**
   * Function that handles the click event on a certain movie on the list.
   * It triggers a modal with all the movie's info.
   * 
   * @param {string} movie_id - The ID of the selected movie.
   */  
  clicked_movie(movie_id: string) {
    this.movie_id = movie_id;
    this.openModal();
  }

  /**
   * Function that triggers the modal.
   */
  openModal() { 
    this.showModal = true; 
  }

  trackById(index: number, movie: Movie): string {
    return movie.id;
  }
}
