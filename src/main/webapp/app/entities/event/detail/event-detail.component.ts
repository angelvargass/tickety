import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from '../event.model';
import { IGalery } from '../../galery/galery.model';
import { IPhoto } from '../../photo/photo.model';
import { DataService } from '../../../shared/data/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../../core/auth/account.service';

import { TicketUpdateComponent } from '../../ticket/update/ticket-update.component';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event: IEvent | null = null;
  galery: IGalery | null = null;
  currentPrice: number | null | undefined = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dataService: DataService,
    protected matDialog: MatDialog,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.dataService.currentprice.subscribe(price => (this.currentPrice = price));

    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      this.galery = <IGalery>this.event?.galery;
    });

    const myPhotos = <IPhoto[]>(<unknown>this.galery?.photos);
    this.event!.showCase = myPhotos[0].url;
  }

  previousState(): void {
    window.history.back();
  }

  setTicketPrice(): void {
    this.dataService.changePrice(this.event?.eventPrice);
    this.openModal();
  }

  openModal(): void {
    this.matDialog
      .open(TicketUpdateComponent, {
        width: '400px',
        height: '280px',
        data: {
          event: this.event,
        },
      })
      .afterClosed()
      .subscribe({
        next: value => {
          console.log(value);
          if (value) {
          }
        },
      });
  }
}
