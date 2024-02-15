import { Component, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { single } from 'rxjs';
import { singleTrip } from '../Trip';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  trips: singleTrip[] = [];

  constructor(private tripsService: TripsService) {}
  ngOnInit() {
    console.log('History component, trips', this.trips);
    console.log('Bought trips: ' + this.tripsService.boughtTrips$);
    this.tripsService.boughtTrips$.subscribe((trips) => {
      this.trips = trips;
    });
  }
}
