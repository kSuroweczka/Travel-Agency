import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  collection,
  getDocs,
  DocumentData,
  addDoc,
  DocumentReference,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { singleTrip } from './Trip';
import { BehaviorSubject, Observable, firstValueFrom, from, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Review } from './Review';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private apiUrl = 'http://localhost:3000/trips';
  private apiUrlReviews = 'http://localhost:3000';

  private isFirebaseSubject = new BehaviorSubject<boolean>(true);
  public isFirebase$ = this.isFirebaseSubject.asObservable();

  private tripsSubject = new BehaviorSubject<singleTrip[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

  private selectedTripsSubject = new BehaviorSubject<singleTrip[]>([]);
  public selectedTrips$ = this.selectedTripsSubject.asObservable();

  public currencySubject = new BehaviorSubject<string>('PLN');
  public currency$ = this.currencySubject.asObservable();

  private boughtTripsSubject = new BehaviorSubject<singleTrip[]>([]);
  public boughtTrips$ = this.tripsSubject.asObservable();

  private filteredTripsSubject = new BehaviorSubject<singleTrip[]>([]);
  public filteredTrips$ = this.tripsSubject.asObservable();
  public isFiltered = false;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  getTrips(): Observable<singleTrip[]> {
    return this.tripsSubject.asObservable();
  }
  getSelectedTrips(): Observable<singleTrip[]> {
    return this.selectedTripsSubject.asObservable();
  }
  removeTripsByIds(tripIds: string[]): void {
    const updatedSelectedTrips = this.selectedTripsSubject.value.filter(
      (trip) => !tripIds.includes(trip.id)
    );

    this.selectedTripsSubject.next(updatedSelectedTrips);
    const updatedTrips = this.tripsSubject.value.map((trip) => {
      const updatedTrip = { ...trip };
      if (tripIds.includes(trip.id)) {
        updatedTrip.members = 0;
        updatedTrip.availableSeats = updatedTrip.maxCapacity;
      }

      return updatedTrip;
    });

    this.tripsSubject.next(updatedTrips);
  }

  ///--------------------------------BACKEND--------------------------------------

  async refreshTrips(): Promise<singleTrip[]> {
    console.log('refresh trips: ', this.isFirebaseSubject.value);
    if (this.isFirebaseSubject.value) {
      const tripsCollection = collection(this.firestore.firestore, 'trips');

      return getDocs(tripsCollection).then((querySnapshot) => {
        const trips: singleTrip[] = [];
        querySnapshot.forEach((doc) => {
          const tripData = doc.data() as singleTrip;
          // let tripData: singleTrip;

          if (!tripData.members) {
            tripData.members = 0;
          }
          if (!tripData.availableSeats) {
            tripData.availableSeats = tripData.maxCapacity;
          }
          tripData.id = doc.id;
          trips.push({ ...tripData });
        });
        this.tripsSubject.next(trips);
        // this.selectedTripsSubject.next(trips);
        return trips;
      });
    } else {
      const trips = await firstValueFrom(
        this.http.get<singleTrip[]>(this.apiUrl)
      );

      const tripsWithMembers = trips.map((trip) => ({
        ...trip,
        members: trip.members || 0,
        availableSeats: trip.availableSeats || trip.maxCapacity,
        id: trip.id || trip.id,
      }));

      this.tripsSubject.next(tripsWithMembers);
      // this.selectedTripsSubject.next(tripsWithMembers);

      return tripsWithMembers;
    }
  }

  async addTrip(trip: singleTrip): Promise<void> {
    if (this.isFirebaseSubject.value) {
      const tripsCollection = collection(this.firestore.firestore, 'trips');
      const docRef = await addDoc(tripsCollection, trip);
      const newTrip = {
        ...trip,
        id: docRef.id,
        members: 0,
        availableSeats: trip.maxCapacity,
      };
      this.tripsSubject.next([...this.tripsSubject.value, newTrip]);
    } else {
      await firstValueFrom(this.http.post<void>(this.apiUrl, trip));

      const newTrip = {
        ...trip,
        members: 0,
        availableSeats: trip.maxCapacity,
        id: trip.id,
      };
      this.tripsSubject.next([...this.tripsSubject.value, newTrip]);
    }
    this.getTrips();
    console.log('w add: ', this.tripsSubject.value);
  }

  async deleteTrip(tripId: string): Promise<void> {
    if (this.isFirebaseSubject.value) {
      const docRef = doc(this.firestore.firestore, 'trips', tripId);
      await deleteDoc(docRef);
      const updatedTrips = this.tripsSubject.value.filter(
        (trip) => trip.id !== tripId
      );
      this.tripsSubject.next(updatedTrips);
      this.selectedTripsSubject.next(updatedTrips);
    } else {
      console.log(tripId);
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${tripId}`));
      const updatedTrips = this.tripsSubject.value.filter(
        (trip) => trip.id !== tripId
      );
      this.selectedTripsSubject.next(updatedTrips);
      this.tripsSubject.next(updatedTrips);
    }
    this.getTrips();
  }
  ///-------------------------REVIEW-------------------------------

  refreshReviews(tripId: string): Observable<Review[]> {
    if (this.isFirebaseSubject.value) {
      const reviewsCollection = collection(this.firestore.firestore, 'reviews');

      return from(getDocs(reviewsCollection)).pipe(
        map((querySnapshot) => {
          const reviews: Review[] = [];
          querySnapshot.forEach((doc) => {
            const reviewData = doc.data() as Review;
            if (reviewData.tripId === tripId) {
              reviews.push({ ...reviewData });
            }
          });

          this.reviewsSubject.next(reviews);

          console.log('service - reviews: ', reviews);
          return reviews;
        })
      );
    } else {
      return this.http
        .get<Review[]>(`${this.apiUrlReviews}/trips/${tripId}/reviews`)
        .pipe(
          map((reviews) => {
            this.reviewsSubject.next(reviews);
            console.log('service - reviews: ', reviews);
            return reviews;
          })
        );
    }
  }

  async addReview(
    tripId: string,
    nickname: string,
    reviewText: string,
    purchaseDate?: Date
  ): Promise<void> {
    const newReview: Review = {
      tripId,
      nickname,
      reviewText,
      purchaseDate,
    };
    if (this.isFirebaseSubject.value) {
      const reviewsCollection = collection(this.firestore.firestore, 'reviews');
      await addDoc(reviewsCollection, newReview);
      this.refreshReviews(tripId);
    } else {
      await firstValueFrom(
        this.http.post<any>(`${this.apiUrlReviews}/reviews`, newReview)
      );
      this.refreshReviews(tripId);
    }
  }

  ///--------------------------------------------------------------------------

  ///--------------------------------------------------------------------------

  reserveTrip(trip: singleTrip): void {
    if (trip.availableSeats > 0) {
      trip.availableSeats--;
      trip.members++;
      this.tripsSubject.next([...this.tripsSubject.value]);
      this.selectedTripsSubject.next([...this.selectedTripsSubject.value]);
      this.updateSelectedTrips(trip);
    }
  }

  cancelTrip(trip: singleTrip): void {
    if (trip.availableSeats < trip.maxCapacity) {
      trip.availableSeats++;
      trip.members--;
      this.tripsSubject.next([...this.tripsSubject.value]);
      this.selectedTripsSubject.next([...this.selectedTripsSubject.value]);
      this.updateSelectedTrips(trip);
    }
  }

  updateSelectedTrips(updatedTrip: singleTrip): void {
    const selectedTrips = this.selectedTripsSubject.value;

    const existingTripIndex = selectedTrips.findIndex(
      (trip) => trip.id === updatedTrip.id
    );

    if (existingTripIndex !== -1) {
      selectedTrips[existingTripIndex] = updatedTrip;
    } else {
      this.selectedTripsSubject.next([...selectedTrips, updatedTrip]);
    }

    // console.log('selected trips: ', this.selectedTripsSubject.value);
  }

  ///---------------------CURRENCY--------------------------------
  setCurrency(currency: string): void {
    this.currencySubject.next(currency);
    console.log('currency: ', currency);
  }

  calculatePriceWithCurrency(price: number): number {
    const currency = this.currencySubject.value;
    switch (currency) {
      case 'PLN':
        return price;
      case 'EUR':
        return Math.round(price * 0.22);
      case 'USD':
        return Math.round(price * 0.27);
      default:
        return price;
    }
  }
  ///--------------------------------------------------------------------------

  addBoughtTrip(trips: singleTrip[]): void {
    this.boughtTripsSubject.next([...this.boughtTripsSubject.value, ...trips]);
  }
  ///--------------------FOR FILTERS---------------------------------
  getUniqueCountries(): string[] {
    let trips: singleTrip[] = [];
    this.getTrips().subscribe((data) => {
      trips = data;
    });
    const uniqueCountries = Array.from(
      new Set(trips.map((trip) => trip.country))
    );
    return uniqueCountries;
  }
  getMinPrice(): number {
    let trips: singleTrip[] = [];
    this.getTrips().subscribe((data) => {
      trips = data;
    });
    const minPrice = Math.min(...trips.map((trip) => trip.unitPrice));
    return minPrice;
  }
  getMaxPrice(): number {
    let trips: singleTrip[] = [];
    this.getTrips().subscribe((data) => {
      trips = data;
    });
    const maxPrice = Math.max(...trips.map((trip) => trip.unitPrice));
    return maxPrice;
  }

  getTripById(tripId: string): Observable<singleTrip | undefined> {
    return this.trips$.pipe(
      map((trips) => trips.find((trip) => trip.id === tripId))
    );
  }

  updateTripRating(tripId: string, rating: number): void {
    const trips = this.tripsSubject.value;
    const updatedTrips = trips.map((trip) => {
      if (trip.id === tripId) {
        trip.rating = rating;
      }
      return trip;
    });

    this.tripsSubject.next(updatedTrips);
    // this.selectedTripsSubject.next(updatedTrips);

    // this.updateAllTrips();
  }

  setDataSource(isFirebase: boolean): void {
    console.log('setDataSource: ', isFirebase);
    this.isFirebaseSubject.next(isFirebase);
    this.tripsSubject.next([]);
    this.selectedTripsSubject.next([]);
    this.refreshTrips();
  }

  applyFilters(country: string[], startDate: Date, endDate: Date): void {
    this.isFiltered = true;
    this.selectedTripsSubject.next([]);
    this.tripsSubject.next([]);

    this.getTrips().subscribe((trips) => {
      const filteredTrips = trips.filter((trip) => {
        let passCountry = true;
        let passStartDate = true;
        let passEndDate = true;

        if (country && country.length > 0 && !country.includes(trip.country)) {
          passCountry = false;
        }

        if (startDate && new Date(trip.startDate) < new Date(startDate)) {
          passStartDate = false;
        }

        if (endDate && new Date(trip.endDate) > new Date(endDate)) {
          passEndDate = false;
        }

        return passCountry && passStartDate && passEndDate;
      });

      this.filteredTripsSubject.next(filteredTrips);
    });
  }
}
