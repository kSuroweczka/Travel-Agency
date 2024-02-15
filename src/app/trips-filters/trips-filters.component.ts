import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripsService } from '../trips.service';
import { NgxSliderModule, Options } from 'ngx-slider-v2';
import { TripFilters } from '../TripsFilters';
import { TripsComponent } from '../trips/trips.component';

@Component({
  selector: 'app-trips-filters',
  templateUrl: './trips-filters.component.html',
  styleUrl: './trips-filters.component.css',
})
export class TripsFiltersComponent implements OnInit {
  @Input() initialFilters: TripFilters | null = null;
  @Output() onFiltersChange = new EventEmitter<TripFilters>();
  locations: string[] = [];

  countries: string[] = [];
  selectedCountries: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceRange: number | null = null;
  startDate: Date = new Date();
  endDate: Date = new Date();
  sliderOptions: Options = {
    floor: 0,
    ceil: 10000,
  };

  constructor(private tripsService: TripsService) {}

  ngOnInit(): void {
    this.countries = this.tripsService.getUniqueCountries();
    this.minPrice = this.tripsService.getMinPrice();
    this.maxPrice = this.tripsService.getMaxPrice();
  }
  applyFilters(): void {
    this.tripsService.isFiltered = true;
    this.tripsService.applyFilters(
      this.selectedCountries,
      this.startDate,
      this.endDate
    );
  }
  clearFilters(): void {
    this.tripsService.isFiltered = false;
  }

  updateSelectedCountries(country: string): void {
    if (this.selectedCountries.includes(country)) {
      this.selectedCountries = this.selectedCountries.filter(
        (c) => c !== country
      );
    } else {
      this.selectedCountries.push(country);
    }
  }
}
