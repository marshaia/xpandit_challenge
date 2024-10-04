import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../services/api.service';
import { PageMovie } from '../../models/page-movie.model';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-filters',
  standalone: true,
  providers: [ApiService],
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './movie-filters.component.html',
  styleUrl: './movie-filters.component.scss'
})
export class MovieFiltersComponent implements OnInit {
  faReset = faRotateLeft;
  year_list: number[] = [];
  active_filter: string | null = null;
  filter_year: number | null = null;
  filter_year_visible: boolean = false;
  loading = false;
  @Output() filterEmitter = new EventEmitter<{type: string, year?: number}>();


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getMovies<{data: PageMovie}>([])
    .then(response => { 
      this.loading = false;
      this.get_all_years(response.data.content);
    })
    .catch(() => { 
      this.loading = false;
      window.alert("Error fetching filter years...") 
    });
  }
  
  get_all_years(movies: Movie[]) {
    this.year_list = Array.from(
      movies.reduce((years_set: Set<number>, movie: Movie) => {
          years_set.add(movie.year);
          return years_set;
        }, new Set<number>())
    ).sort((a,b) => b - a);
  }

  clicked_top_10_revenue() {
    // if it was previously selected, then remove
    if (this.active_filter === "top") {
      this.active_filter = null;
      this.filterEmitter.emit({type: 'null'})
    }
    else {
      this.active_filter = 'top'
      this.filterEmitter.emit({type: 'top'})
    }
  }

  clicked_top_revenue_by_year() {
    // clear previous filter
    if (this.active_filter === 'top') this.filterEmitter.emit({type: 'null'})
    this.active_filter = 'top_year';
    this.filter_year_visible = true;
  }

  clicked_year(year: number): void {
    this.active_filter = 'top_year';
    this.filter_year = year;
    this.closeYearFilter();

    this.filterEmitter.emit({type: 'top_year', year: year})
  }

  closeYearFilter(): void {
    this.filter_year_visible = false;
    // if user didn't pick any year, then remove selection on filter
    if (this.filter_year === null && this.active_filter === 'top_year') this.active_filter = null;
  }

  reset_top_by_year() {
    this.active_filter = null;
    this.filter_year = null;
    this.closeYearFilter();

    this.filterEmitter.emit({type: 'null'})
  }

  onOverlayClick(event: MouseEvent): void {
    // Close the year component only if the overlay is clicked, not the content
    if (event.target === event.currentTarget) {
      this.closeYearFilter();
    }
  }
}
