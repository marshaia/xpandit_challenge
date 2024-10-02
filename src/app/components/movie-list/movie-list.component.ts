import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CustomModalComponent } from '../custom-modal/custom-modal.component';
import { ApiService } from '../../services/api.service';
import { PageMovie } from '../../models/page-movie.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-movie-list',
  standalone: true,
  providers: [ApiService],
  imports: [CommonModule, FontAwesomeModule, CustomModalComponent, HttpClientModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  faEye = faEye;
  page_movie: PageMovie | null = null;
  movie_id: string | null = null;
  showModal = false;
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchAllMovies();
  }

  fetchAllMovies(): void {
    this.apiService.getMovies<{data: PageMovie}>()
      .then(response => { 
        this.loading = false
        this.page_movie = response.data
      })
      .catch(() => { 
        window.alert("Error fetching movies. Please try again!") 
      });
  }

  clicked_movie(movie_id: string) {
    this.movie_id = movie_id
    this.openModal()
  }

  openModal() { this.showModal = true }
}
