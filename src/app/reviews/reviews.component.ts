import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TripsService } from '../trips.service';
import { Review } from '../Review';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit, OnDestroy {
  @Input() tripId: string = '';
  reviewForm: FormGroup;
  reviews: Review[] = [];
  errors: string[] = [];
  reviewsSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private tripsService: TripsService
  ) {
    this.reviewForm = this.formBuilder.group({
      nickname: ['', Validators.required],
      reviewText: [
        '',
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(500),
        ],
      ],
      purchaseDate: [null],
    });
  }

  ngOnInit(): void {
    this.refreshReviews();
    this.reviewsSubscription = this.tripsService.reviews$.subscribe(
      (reviews) => {
        this.reviews = reviews;
      }
    );
  }

  ngOnDestroy(): void {
    this.reviewsSubscription.unsubscribe();
  }

  refreshReviews(): void {
    this.tripsService.refreshReviews(this.tripId).subscribe();
  }

  onSubmit(): void {
    this.errors = [];
    if (this.reviewForm.valid) {
      const { nickname, reviewText, purchaseDate } = this.reviewForm.value;
      this.tripsService
        .addReview(this.tripId, nickname, reviewText, purchaseDate)
        .then(() => this.refreshReviews());

      this.reviewForm.reset();
    } else {
      this.errors.push('Please check the form for errors.');

      if (this.reviewForm.get('nickname')?.hasError('required')) {
        this.errors.push('Nickname is required.');
      }

      if (this.reviewForm.get('reviewText')?.hasError('required')) {
        this.errors.push('Review text is required.');
      }

      if (this.reviewForm.get('reviewText')?.hasError('minlength')) {
        this.errors.push('Review text should be at least 50 characters.');
      }

      if (this.reviewForm.get('reviewText')?.hasError('maxlength')) {
        this.errors.push('Review text should not exceed 500 characters.');
      }
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.reviewForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
