import { Component, Inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs/operators';

import { TicketFormGroup, TicketFormService } from './ticket-form.service';
import { ITicket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { TicketStatus } from 'app/entities/enumerations/ticket-status.model';
import { IUserAccount } from '../../user-account/user-account.model';
import { UserAccountService } from '../../user-account/service/user-account.service';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';
import { DataService } from '../../../shared/data/data.service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html',
  styleUrls: ['./ticket-update.component.scss'],
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  ticket: ITicket | null = null;
  ticketStatusValues = Object.keys(TicketStatus);

  userAccountsCollection: IUserAccount[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm: TicketFormGroup = this.ticketFormService.createTicketFormGroup();
  currentAccount: Account | null = null;
  parentEvent: IEvent | null = null;

  ticketCount = 0;
  currentPrice: number | null | undefined = null;
  totalPay: number | null | undefined = null;

  constructor(
    protected ticketService: TicketService,
    protected ticketFormService: TicketFormService,
    protected userAccountService: UserAccountService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected dataService: DataService,
    protected calendar: NgbCalendar,
    @Inject(MAT_DIALOG_DATA) protected data: any
  ) {
    console.log(data.event.eventName);
  }

  compareUserAccount = (o1: IUserAccount | null, o2: IUserAccount | null): boolean => this.userAccountService.compareUserAccount(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  ngOnInit(): void {
    this.dataService.currentprice.subscribe(price => (this.currentPrice = price));

    this.accountService.getAuthenticationState().subscribe(account => {
      this.currentAccount = account;
    });

    this.eventService.find(this.data.event.id).subscribe(event => (this.parentEvent = <IEvent>(<unknown>event.body)));

    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.ticket = ticket;
      if (ticket) {
        this.updateForm(ticket);
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    //window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tickets: any[] = [];
    const ticket = this.ticketFormService.getTicket(this.editForm);
    ticket.event = this.parentEvent;
    ticket.ticketStatus = TicketStatus.SOLD;
    ticket.amount = this.currentPrice;

    for (let i = 0; i < this.ticketCount; i++) {
      tickets.push(ticket);
    }

    ticket.userAccount = this.currentAccount?.userAccount;
    if (ticket.id !== null) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(tickets));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ticket: ITicket): void {
    this.ticket = ticket;
    this.ticketFormService.resetForm(this.editForm, ticket);

    this.userAccountsCollection = this.userAccountService.addUserAccountToCollectionIfMissing<IUserAccount>(
      this.userAccountsCollection,
      ticket.userAccount
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(this.eventsSharedCollection, ticket.event);
  }

  protected loadRelationshipsOptions(): void {
    this.userAccountService
      .query({ filter: 'ticket-is-null' })
      .pipe(map((res: HttpResponse<IUserAccount[]>) => res.body ?? []))
      .pipe(
        map((userAccounts: IUserAccount[]) =>
          this.userAccountService.addUserAccountToCollectionIfMissing<IUserAccount>(userAccounts, this.ticket?.userAccount)
        )
      )
      .subscribe((userAccounts: IUserAccount[]) => (this.userAccountsCollection = userAccounts));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.ticket?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));
  }

  addticket(): void {
    this.ticketCount = this.ticketCount + 1;
    this.totalPay = (this.currentPrice || 0) * this.ticketCount;
  }

  subtractticket(): void {
    if (this.ticketCount >= 1) {
      this.ticketCount = this.ticketCount - 1;
      this.totalPay = (this.currentPrice || 0) * this.ticketCount;
    }
  }
}
