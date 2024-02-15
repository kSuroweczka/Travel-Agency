import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsFiltersComponent } from './trips-filters.component';

describe('TripsFiltersComponent', () => {
  let component: TripsFiltersComponent;
  let fixture: ComponentFixture<TripsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripsFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
