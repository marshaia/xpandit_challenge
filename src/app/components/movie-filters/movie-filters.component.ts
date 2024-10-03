import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie-filters',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './movie-filters.component.html',
  styleUrl: './movie-filters.component.scss'
})
export class MovieFiltersComponent {
  faReset = faRotateLeft;
  active_filter: string | null = null;
  filter_year: number | null = null;
  filter_year_visible: boolean = false;

  @Output() filterEmitter = new EventEmitter<{type: string, year?: number}>();


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
