import { Component } from '@angular/core';
import { TripsService } from './trips.service';
import { singleTrip } from './Trip';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'theoffice';
  selectedCurrency: string = 'PLN';
  public isFirebaseSubject = new BehaviorSubject<boolean>(true);
  public isFirebase$ = this.isFirebaseSubject.asObservable();

  constructor(public tripsService: TripsService) {
    tripsService.refreshTrips();
  }
  ngOnInit(): void {
    this.tripsService.setDataSource(this.isFirebaseSubject.value);
  }
  onCurrencyChange(): void {
    this.tripsService.setCurrency(this.selectedCurrency);
  }
  onServerChange(): void {
    console.log('onServerChange: ', this.isFirebaseSubject.value);
    this.isFirebaseSubject.next(!this.isFirebaseSubject.value);
    this.tripsService.setDataSource(this.isFirebaseSubject.value);
  }
}
