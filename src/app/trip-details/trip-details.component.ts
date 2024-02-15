import { Component, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { singleTrip } from '../Trip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';

import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css',
})
export class TripDetailsComponent implements OnInit {
  @ViewChild('slickModal') slickModal: SlickCarouselComponent | undefined;
  trip: singleTrip | undefined;
  router: any;
  photos = [
    'https://www.tasteaway.pl/wp-content/uploads/2022/08/Prodromos-_3-990x742.jpg',
    'https://images.r.pl/zdjecia/lokalizacje/29/grecja_29_106700_160144_1000x1000.jpg',
    'https://www.clickandgo.pl/blog/wp-content/uploads/sites/2/2019/05/grecja1.jpg',
  ];

  constructor(
    private route: ActivatedRoute,
    private tripsService: TripsService,
    config: NgbCarouselConfig
  ) {
    config.interval = 0;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const tripId = params['id'];
      this.loadTripDetails(tripId);
    });
  }
  activeIndex: number = 0;

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.photos.length;
  }

  prevSlide(): void {
    this.activeIndex =
      this.activeIndex - 1 < 0 ? this.photos.length - 1 : this.activeIndex - 1;
  }

  maxRating: number = 5;
  ratings: number[] = Array.from({ length: this.maxRating }, (_, i) => i + 1);
  ratedStars: number = 0;

  rateTrip(rating: number): void {
    this.ratedStars = rating;
    // console.log('Rated stars: ' + rating);
    this.tripsService.updateTripRating(this.trip!.id, this.ratedStars);
  }

  getStarClass(index: number): string {
    return index < this.ratedStars ? 'rated' : 'unrated';
  }
  getRatingText(): string {
    return `${this.ratedStars}/${this.maxRating}`;
  }

  loadTripDetails(tripId: string): void {
    this.tripsService.getTripById(tripId).subscribe((trip) => {
      this.trip = trip;
    });
  }

  reserveTrip(trip: singleTrip): void {
    this.tripsService.reserveTrip(trip);
  }

  cancelTrip(trip: singleTrip): void {
    this.tripsService.cancelTrip(trip);
  }
  goBack(): void {
    this.router.navigate(['/trips']);
  }

  calculatePriceWithCurrency(price: number): number {
    return this.tripsService.calculatePriceWithCurrency(price);
  }

  whichCurrency(): string {
    return this.tripsService.currencySubject.value;
  }
}
