import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVenue } from '../venue.model';

@Component({
  selector: 'jhi-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.scss'],
})
export class VenueDetailComponent implements OnInit {
  venue: IVenue | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venue }) => {
      this.venue = venue;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
