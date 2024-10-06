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
  @Output() filterEmitter = new EventEmitter<{type: string, year?: number}>(); //Sends the user's filter selection 

  /**
   * @constructor
   * @param {ApiService} apiService 
   */
  constructor(private apiService: ApiService) {}

  /**
   * Fetches all available movies from the backend. 
   * The data fetched is used to generate the year list on 'Top 10 Revenue per Year' filter.
   */
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
  
  /**
   * Helper function to the OnInit method.
   * Receives a list of movies and stores the release years in an array (without duplicates).
   * 
   * @param {Movie[]} movies List of movies to iterate through
   */
  get_all_years(movies: Movie[]) {
    this.year_list = Array.from(
      movies.reduce((years_set: Set<number>, movie: Movie) => {
          years_set.add(movie.year);
          return years_set;
        }, new Set<number>())
    ).sort((a,b) => b - a);
  }

  /**
   * Function to handle the click event on the 'Top 10 Revenue' filter.
   * If the filter is already selected, it deselects it; otherwise, it selects the filter.
   * In both cases, it emits the action to the parent component.
   */
  clicked_top_10_revenue() {
    // if it was previously selected
    if (this.active_filter === "top") {
      this.active_filter = null;
      this.filterEmitter.emit({type: 'null'})
    }
    else {
      this.active_filter = 'top'
      this.filterEmitter.emit({type: 'top'})
    }
  }

  /**
   * Function to handle the click event on the 'Top 10 Revenue per Year' filter.
   * It opens the 'Select Year' modal.
   */
  clicked_top_revenue_by_year() {
    // clear previous filter
    if (this.active_filter === 'top') this.filterEmitter.emit({type: 'null'})
    this.active_filter = 'top_year';
    this.filter_year_visible = true;
  }

  /**
   * Function to handle the click event on a specific year of the 'Top 10 Revenue per Year' filter.
   * It saves the year selected, closes the 'Select Year' modal and emits the action to the parent component.
   * 
   * @param {number} year - Year chosen to calculate the 'Top 10 revenue per Year' Filter
   */
  clicked_year(year: number): void {
    this.active_filter = 'top_year';
    this.filter_year = year;
    this.closeYearFilter();

    this.filterEmitter.emit({type: 'top_year', year: year})
  }

  /**
   * Function to close the 'Select Year' modal.
   * If the user closes the modal without picking any year, it removes the selection
   * on the 'Top 10 Revenue per Year' filter.
   */
  closeYearFilter(): void {
    this.filter_year_visible = false;
    // if user didn't pick any year, then remove selection on filter
    if (this.filter_year === null && this.active_filter === 'top_year') this.active_filter = null;
  }

  /**
   * Function to handle the click event on the reset icon of the 'Top 10 Revenue per Year' filter.
   * It resets the selected filter and emits the action to the parent component.
   */
  reset_top_by_year() {
    this.active_filter = null;
    this.filter_year = null;
    this.closeYearFilter();

    this.filterEmitter.emit({type: 'null'})
  }

  /**
   * Function to handle click events outside of 'Select Year' modal.
   * If user clicks out of the modal, it automatically closes.
   * 
   * @param {MouseEvent} event - Click Event
   */
  onOverlayClick(event: MouseEvent): void {
    // Close the year component only if the overlay is clicked, not the content
    if (event.target === event.currentTarget) {
      this.closeYearFilter();
    }
  }
}
