import { Component, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { singleTrip } from '../Trip';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent {
  selectedTripsCount = 0;
  selectedTripsTotalPrice = 0;

  constructor(private tripsService: TripsService) {
    tripsService.selectedTrips$.subscribe((trips) => {
      this.selectedTripsCount = trips.reduce(
        (sum, trip) => sum + trip.members,
        0
      );
      this.selectedTripsTotalPrice = trips.reduce(
        (sum, trip) => sum + trip.members * trip.unitPrice,
        0
      );
    });
  }
  whichCurrency(): string {
    return this.tripsService.currencySubject.value;
  }
  calculatePriceWithCurrency(price: number): number {
    return this.tripsService.calculatePriceWithCurrency(price);
  }
}
