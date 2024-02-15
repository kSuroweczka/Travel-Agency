import { Component, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { singleTrip } from '../Trip';
import { TripsFiltersComponent } from '../trips-filters/trips-filters.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent implements OnInit {
  trips: singleTrip[] = [];
  theCheapest: number | 0;
  theMostExpensive: number | 0;
  uniqueCountries: string[] = [];

  pageSize = 2; // liczba wycieczek na stronie
  currentPage = 1;
  totalPages = 1;
  paginatedTrips: singleTrip[] = [];
  pageArray: number[] = [];
  filters: TripsFiltersComponent;

  constructor(private tripsService: TripsService, private router: Router) {
    this.theCheapest = this.findTheCheapest();
    this.theMostExpensive = this.findTheMostExpensive();
    this.filters = new TripsFiltersComponent(tripsService);
  }

  ngOnInit() {
    this.getTrips();
    this.updateFilters();
  }
  updateFilters() {
    this.uniqueCountries = this.tripsService.getUniqueCountries();
    // Dodaj tutaj inne funkcje aktualizujące filtry, jeśli są dostępne
  }

  getTrips() {
    this.tripsService.getTrips().subscribe((data) => {
      this.trips = data;
      this.calculateTotalPages();
      this.paginateTrips();
    });
  }

  removeTripByID(tripId: string) {
    this.tripsService.deleteTrip(tripId).then(() => {
      this.getTrips();
    });
  }

  reserveTrip(trip: singleTrip): void {
    this.tripsService.reserveTrip(trip);
  }

  cancelTrip(trip: singleTrip): void {
    this.tripsService.cancelTrip(trip);
  }
  /// -----------------------------------------
  findTheCheapest(): number {
    if (this.trips.length === 0) {
      return 0;
    }

    let minPrice = this.trips[0].unitPrice;

    for (let i = 1; i < this.trips.length; i++) {
      if (this.trips[i].unitPrice < minPrice) {
        minPrice = this.trips[i].unitPrice;
      }
    }
    return minPrice;
  }
  findTheMostExpensive(): number {
    if (this.trips.length === 0) {
      return 0;
    }

    let maxPrice = this.trips[0].unitPrice;

    for (let i = 1; i < this.trips.length; i++) {
      if (this.trips[i].unitPrice > maxPrice) {
        maxPrice = this.trips[i].unitPrice;
      }
    }

    return maxPrice;
  }

  /// --------------CURRENCY------------------
  calculatePriceWithCurrency(price: number): number {
    return this.tripsService.calculatePriceWithCurrency(price);
  }

  whichCurrency(): string {
    return this.tripsService.currencySubject.value;
  }

  changeCurrency(newCurrency: string): void {
    this.tripsService.setCurrency(newCurrency);
  }
  /// -----------------------------------------
  navigateToTripDetails(tripId: string): void {
    this.router.navigate(['/trip-details', tripId]);
  }

  /// -----------------------------------------

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.trips.length / this.pageSize);
    this.pageArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  paginateTrips(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTrips = this.trips.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateTrips();
  }

  onFilterChanged(filters: any): void {
    const { countries, startDate, endDate } = filters;
    this.tripsService.applyFilters(countries, startDate, endDate);
  }
}
