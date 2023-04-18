import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from '../event.model';
import { IPhoto } from '../../photo/photo.model';
import { IGalery } from '../../galery/galery.model';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event: IEvent | null = null;
  galery: IGalery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      this.galery = <IGalery>this.event?.galery;
    });

    console.log(this.galery?.photos);
  }

  previousState(): void {
    window.history.back();
  }
}
