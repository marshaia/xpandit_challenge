import { Component } from '@angular/core';
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

  clicked_top_10_revenue() {
    if (this.active_filter === "top") {
      this.active_filter = null;
      // enviar emit para fetch de todos os movies
    }
    else {
      this.active_filter = 'top'
      // executar ordenação
    }
  }

  clicked_top_revenue_by_year() {
    this.active_filter = 'top_year';
    this.filter_year_visible = true;
  }

  reset_top_by_year() {
    this.active_filter = null;
    this.filter_year = null;
    this.closeYearFilter();
    // enviar emit para simbolizar retirada do filtro
  }

  clicked_year(year: number): void {
    this.active_filter = 'top_year';
    this.filter_year = year;
    this.closeYearFilter();
  }

  closeYearFilter(): void {
    this.filter_year_visible = false;
    if (this.filter_year === null && this.active_filter === 'top_year') this.active_filter = null;
  }

  onOverlayClick(event: MouseEvent): void {
    // Close the year component only if the overlay is clicked, not the modal content
    if (event.target === event.currentTarget) {
      this.closeYearFilter();
    }
  }
}
