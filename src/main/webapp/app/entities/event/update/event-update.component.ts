import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EventFormService, EventFormGroup } from './event-form.service';
import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';
import { IGalery } from 'app/entities/galery/galery.model';
import { GaleryService } from 'app/entities/galery/service/galery.service';
import { IUserAccount } from 'app/entities/user-account/user-account.model';
import { UserAccountService } from 'app/entities/user-account/service/user-account.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IVenue } from 'app/entities/venue/venue.model';
import { VenueService } from 'app/entities/venue/service/venue.service';
import { EventSatus } from 'app/entities/enumerations/event-satus.model';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.scss'],
})
export class EventUpdateComponent implements OnInit {
  account: Account | null = null;
  isSaving = false;
  event: IEvent | null = null;
  eventSatusValues = Object.keys(EventSatus);
  eventStatusCurrent = EventSatus;
  galeriesCollection: IGalery[] = [];
  userAccountsSharedCollection: IUserAccount[] = [];
  organizationsSharedCollection: IOrganization[] = [];
  venuesSharedCollection: IVenue[] = [];

  editForm: EventFormGroup = this.eventFormService.createEventFormGroup();

  constructor(
    private router: Router,
    protected userService: UserService,
    protected accountService: AccountService,
    protected eventService: EventService,
    protected eventFormService: EventFormService,
    protected galeryService: GaleryService,
    protected userAccountService: UserAccountService,
    protected organizationService: OrganizationService,
    protected venueService: VenueService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGalery = (o1: IGalery | null, o2: IGalery | null): boolean => this.galeryService.compareGalery(o1, o2);

  compareUserAccount = (o1: IUserAccount | null, o2: IUserAccount | null): boolean => this.userAccountService.compareUserAccount(o1, o2);

  compareOrganization = (o1: IOrganization | null, o2: IOrganization | null): boolean =>
    this.organizationService.compareOrganization(o1, o2);

  compareVenue = (o1: IVenue | null, o2: IVenue | null): boolean => this.venueService.compareVenue(o1, o2);

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      if (event) {
        this.updateForm(event);
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.eventFormService.getEvent(this.editForm);
    event.organization = this.account?.userAccount?.organization;
    event.userAccount = this.account?.userAccount;
    console.log(this.account);
    if (event.id !== null) {
      this.subscribeToSaveResponse(this.eventService.update(event));
      this.router.navigate([`event`]);
    } else {
      event.eventSatus = this.eventStatusCurrent.OPEN;
      this.subscribeToSaveResponse(this.eventService.create(event));
      this.router.navigate([`galery/new`]);
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {}

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): boolean {
    this.isSaving = false;
    return this.isSaving;
  }

  protected updateForm(event: IEvent): void {
    this.event = event;
    this.eventFormService.resetForm(this.editForm, event);

    this.galeriesCollection = this.galeryService.addGaleryToCollectionIfMissing<IGalery>(this.galeriesCollection, event.galery);
    this.userAccountsSharedCollection = this.userAccountService.addUserAccountToCollectionIfMissing<IUserAccount>(
      this.userAccountsSharedCollection
    );
    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(
      this.organizationsSharedCollection,
      event.organization
    );
    this.venuesSharedCollection = this.venueService.addVenueToCollectionIfMissing<IVenue>(this.venuesSharedCollection, event.venue);
  }

  protected loadRelationshipsOptions(): void {
    this.galeryService
      .query({ filter: 'event-is-null' })
      .pipe(map((res: HttpResponse<IGalery[]>) => res.body ?? []))
      .pipe(map((galeries: IGalery[]) => this.galeryService.addGaleryToCollectionIfMissing<IGalery>(galeries, this.event?.galery)))
      .subscribe((galeries: IGalery[]) => (this.galeriesCollection = galeries));

    this.userAccountService
      .query()
      .pipe(map((res: HttpResponse<IUserAccount[]>) => res.body ?? []))
      .pipe(map((userAccounts: IUserAccount[]) => this.userAccountService.addUserAccountToCollectionIfMissing<IUserAccount>(userAccounts)))
      .subscribe((userAccounts: IUserAccount[]) => (this.userAccountsSharedCollection = userAccounts));

    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(organizations, this.event?.organization)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.venueService
      .query()
      .pipe(map((res: HttpResponse<IVenue[]>) => res.body ?? []))
      .pipe(map((venues: IVenue[]) => this.venueService.addVenueToCollectionIfMissing<IVenue>(venues, this.event?.venue)))
      .subscribe((venues: IVenue[]) => (this.venuesSharedCollection = venues));
  }
}
