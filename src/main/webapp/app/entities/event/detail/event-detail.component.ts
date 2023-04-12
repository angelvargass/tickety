import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from '../event.model';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
})
export class EventDetailComponent implements OnInit {
  event: IEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
    });

    console.log(this.event);
  }

  previousState(): void {
    window.history.back();
  }
}
