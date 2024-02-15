import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { singleTrip } from '../Trip';
import { TripsService } from '../trips.service';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css',
})
export class AddTripComponent {
  constructor(private tripsService: TripsService) {}

  submitForm(form: NgForm) {
    if (form.valid) {
      this.tripsService.addTrip(form.value);
      form.resetForm();
    }
  }
}
