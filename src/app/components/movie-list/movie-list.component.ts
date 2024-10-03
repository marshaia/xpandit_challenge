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
  
  page = 0;
  page_size = 10;
  loading = false;
  has_any_filter_active = false;

  showModal = false;
  movie_id: string | null = null;
  
  page_movie: PageMovie | null = null;
  hasMoreMoviesToFetch = true;
  movies: Movie[] = [];


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {    
    this.loading = true;
    this.apiService.getMovies<{data: PageMovie}>([`page=${this.page}`, `size=${this.page_size}`])
      .then(response => { 
        this.loading = false;
        this.page += 1;
        this.hasMoreMoviesToFetch = !response.data.last;

        this.page_movie = response.data;
        this.movies = this.movies.concat(response.data.content);

        if (response.data.first) this.checkIfNeedMoreMovies();
      })
      .catch(() => { 
        this.loading = false;
        window.alert("Error fetching movies. Please try again!") 
      });
  }

  checkIfNeedMoreMovies(): void {
    const movieTableHeight = this.movies.length * 48; // Approximate height per movie row
    const viewportHeight = window.innerHeight;

    // Fetch more movies if the table height is less than the viewport height
    if (movieTableHeight < viewportHeight && this.hasMoreMoviesToFetch) {
      this.fetchMovies(); 
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.has_any_filter_active) {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      // Fetch more movies when reaching the bottom
      if (scrollPosition >= pageHeight && !this.loading) {
        this.fetchMovies(); 
      }
    }
    
  }

  filter_movies($event: {type: string, year?: number}): void {
    this.reset_table_pagination();
    this.movies = [];

    switch ($event.type) {
      case 'null':
        this.has_any_filter_active = false;
        this.fetchMovies();
        break;
      case 'top':
        this.has_any_filter_active = true;
        this.fetch_top_10_revenue(false);
        break;
      case 'top_year':
        this.has_any_filter_active = true;
        this.fetch_top_10_revenue(true, $event.year ?? 0);
        break;
      default:
        break;
    }
  }

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

  get_top_movies(top_size: number, movies: Movie[]): Movie[] {
    const sorted = [...movies].sort((a, b) => b.revenue - a.revenue);
    return sorted.slice(0, top_size);
  }

  reset_table_pagination() {
    this.page = 0;
    this.hasMoreMoviesToFetch = true;
  }

  trackById(index: number, movie: Movie): string {
    return movie.id;
  }

  clicked_movie(movie_id: string) {
    this.movie_id = movie_id;
    this.openModal();
  }

  openModal() { this.showModal = true; }
}
