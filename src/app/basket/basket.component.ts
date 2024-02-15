import { Component } from '@angular/core';
import { TripsService } from '../trips.service';
import { singleTrip } from '../Trip';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent {
  selectedTrips: singleTrip[] = [];
  selectedByCheckbox: singleTrip[] = [];

  constructor(private tripsService: TripsService) {}

  ngOnInit() {
    this.tripsService.selectedTrips$.subscribe((trips) => {
      this.selectedTrips = trips;
      console.log('Selected trips: ', this.selectedTrips);
    });

    console.log('Selected tripssssssssssss: ', this.selectedTrips);
  }
  atLeastOneCheckboxSelected(): boolean {
    return this.selectedByCheckbox.length > 0;
  }

  reserveTrip(trip: singleTrip): void {
    this.tripsService.reserveTrip(trip);
  }

  cancelTrip(trip: singleTrip): void {
    this.tripsService.cancelTrip(trip);
  }
  //-----------------CURRENCY---------------------
  whichCurrency(): string {
    return this.tripsService.currencySubject.value;
  }

  calculatePriceWithCurrency(price: number): number {
    return this.tripsService.calculatePriceWithCurrency(price);
  }

  calculateTotalPrice(trip: singleTrip): number {
    const price = this.calculatePriceWithCurrency(trip.unitPrice);
    return trip.members * price;
  }

  calculateTotalPriceAllTrips(): number {
    return this.selectedTrips.reduce(
      (sum, trip) => sum + this.calculateTotalPrice(trip),
      0
    );
  }
  //-----------------------------------------------

  //-----------------BUY TRIPS---------------------
  buyTrips(): void {
    this.tripsService.addBoughtTrip(this.selectedByCheckbox);

    const selectedTripIds = this.selectedByCheckbox.map((trip) => trip.id);

    this.tripsService.removeTripsByIds(selectedTripIds);

    this.selectedByCheckbox = [];
  }

  checkboxTrip(trip: singleTrip): void {
    const existingIndex = this.selectedByCheckbox.findIndex(
      (selectedTrip) => selectedTrip.id === trip.id
    );
    if (existingIndex !== -1) {
      this.selectedByCheckbox.splice(existingIndex, 1);
    } else {
      this.selectedByCheckbox.push(trip);
    }
  }
}
