import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TicketFormService, TicketFormGroup } from './ticket-form.service';
import { ITicket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { TicketStatus } from 'app/entities/enumerations/ticket-status.model';
import { IUserAccount } from '../../user-account/user-account.model';
import { UserAccountService } from '../../user-account/service/user-account.service';

@Component({
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html',
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  ticket: ITicket | null = null;
  ticketStatusValues = Object.keys(TicketStatus);

  userAccountsCollection: IUserAccount[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm: TicketFormGroup = this.ticketFormService.createTicketFormGroup();

  constructor(
    protected ticketService: TicketService,
    protected ticketFormService: TicketFormService,
    protected userAccountService: UserAccountService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserAccount = (o1: IUserAccount | null, o2: IUserAccount | null): boolean => this.userAccountService.compareUserAccount(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.ticket = ticket;
      if (ticket) {
        this.updateForm(ticket);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.ticketFormService.getTicket(this.editForm);
    if (ticket.id !== null) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
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
}
