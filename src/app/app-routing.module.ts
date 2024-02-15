import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { BasketComponent } from './basket/basket.component';
import { HistoryComponent } from './history/history.component';
import { TripDetailsComponent } from './trip-details/trip-details.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'offers', component: TripsComponent },
  { path: 'addTrip', component: AddTripComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'trip-details/:id', component: TripDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
