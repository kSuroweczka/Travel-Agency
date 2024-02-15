export interface TripFilters {
  country: string[];
  minDate: string;
  maxDate: string;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number[];
}
