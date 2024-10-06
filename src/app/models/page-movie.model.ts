import { Movie } from "./movie.model"

export interface Sort {
  sorted: boolean,
  unsorted: boolean,
  empty: boolean
}

export interface Pageable {
  sort: Sort,
  offset: number,
  pageNumber: number,
  pageSize: number,
  paged: boolean,
  unpaged: boolean,
}

/**
 * Interface for the complete information of a movie list request.
 * 
 * @interface
 */
export interface PageMovie {
  totalPages: number,	
  totalElements: number,
  sort: Sort,
  size: number,
  content: Movie[],
  number: number,
  pageable: Pageable,
  first: boolean,
  last: boolean,
  numberOfElements: number,
  empty: boolean
}