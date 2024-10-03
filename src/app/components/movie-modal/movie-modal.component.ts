import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { DetailedMovie } from '../../models/detailed-movie.model';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-movie-modal',
  templateUrl: './movie-modal.component.html',
  styleUrl: './movie-modal.component.scss',
  imports: [FontAwesomeModule, CommonModule]
})
export class MovieModalComponent implements OnChanges {
  faClose = faX
  loading = false;
  movie: DetailedMovie | null = null;

  @Input() isVisible = false;
  @Input() movie_id: string | null = null;
  @Output() close = new EventEmitter<void>();

  
  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.movie_id !== null) this.fetchMovie();
  }

  fetchMovie(): void {
    this.loading = true;
    this.apiService.getMovie<{data: DetailedMovie}>(this.movie_id ?? "")
      .then(response => {
        this.loading = false;
        this.movie = response.data;
      })
      .catch(() => {
        this.close.emit()
        window.alert("Error fetching movie. Please try again!")
      });
  }

  closeModal() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    // Close the modal only if the overlay is clicked, not the modal content
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
