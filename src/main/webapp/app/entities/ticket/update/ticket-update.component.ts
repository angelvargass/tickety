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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

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

  public payPalConfig?: IPayPalConfig;

  constructor(
    protected ticketService: TicketService,
    protected ticketFormService: TicketFormService,
    protected userAccountService: UserAccountService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected dataService: DataService,
    protected calendar: NgbCalendar,
    @Inject(MAT_DIALOG_DATA) protected data: any,
    private dialogRef: MatDialogRef<TicketUpdateComponent>
  ) {
    console.log(data.event.eventName);
  }

  compareUserAccount = (o1: IUserAccount | null, o2: IUserAccount | null): boolean => this.userAccountService.compareUserAccount(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  ngOnInit(): void {
    this.initConfig();
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

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AVhwfs7Pf52DU9ZkscvX7d0qYMLsv6g8wSQfJiorqIBd1s1Pf_xWBv2JGwxP0liijXnP7R4vjnXAoULq',
      createOrderOnClient: data =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.getTotalValueOfTickets().toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.getTotalValueOfTickets().toFixed(2),
                  },
                },
              },
              items: this.getPaypalItems(),
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        this.save();
        this.closeDialog(true);
      },
      onClientAuthorization: data => {},
      onCancel: (data, actions) => {
        this.closeDialog(false);
      },
      onError: err => {
        //Show error
      },
      onClick: (data, actions) => {},
    };
  }

  private closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }

  previousState(): void {
    //window.history.back();
  }

  private getPaypalItems(): any[] {
    const items: any[] = [];

    items.push({
      name: this.parentEvent?.eventName,
      quantity: 1,
      category: 'DIGITAL_GOODS',
      unit_amount: {
        currency_code: 'USD',
        // @ts-ignore
        value: this.getTotalValueOfTickets().toFixed(2),
      },
    });

    return items;
  }

  private getTotalValueOfTickets(): number {
    return (this.ticketCount * this.currentPrice!) / this.getUSDtoCRCExchange();
  }

  private getUSDtoCRCExchange(): number {
    return 548.58;
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
