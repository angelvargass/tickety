import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventFormService } from './event-form.service';
import { EventService } from '../service/event.service';
import { IEvent } from '../event.model';
import { IGalery } from 'app/entities/galery/galery.model';
import { GaleryService } from 'app/entities/galery/service/galery.service';
import { IUserAccount } from 'app/entities/user-account/user-account.model';
import { UserAccountService } from 'app/entities/user-account/service/user-account.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IVenue } from 'app/entities/venue/venue.model';
import { VenueService } from 'app/entities/venue/service/venue.service';

import { EventUpdateComponent } from './event-update.component';

describe('Event Management Update Component', () => {
  let comp: EventUpdateComponent;
  let fixture: ComponentFixture<EventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventFormService: EventFormService;
  let eventService: EventService;
  let galeryService: GaleryService;
  let userAccountService: UserAccountService;
  let organizationService: OrganizationService;
  let venueService: VenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventFormService = TestBed.inject(EventFormService);
    eventService = TestBed.inject(EventService);
    galeryService = TestBed.inject(GaleryService);
    userAccountService = TestBed.inject(UserAccountService);
    organizationService = TestBed.inject(OrganizationService);
    venueService = TestBed.inject(VenueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call galery query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const galery: IGalery = { id: 50145 };
      event.galery = galery;

      const galeryCollection: IGalery[] = [{ id: 72276 }];
      jest.spyOn(galeryService, 'query').mockReturnValue(of(new HttpResponse({ body: galeryCollection })));
      const expectedCollection: IGalery[] = [galery, ...galeryCollection];
      jest.spyOn(galeryService, 'addGaleryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(galeryService.query).toHaveBeenCalled();
      expect(galeryService.addGaleryToCollectionIfMissing).toHaveBeenCalledWith(galeryCollection, galery);
      expect(comp.galeriesCollection).toEqual(expectedCollection);
    });

    it('Should call UserAccount query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const userAccount: IUserAccount = { id: 59224 };
      event.userAccount = userAccount;

      const userAccountCollection: IUserAccount[] = [{ id: 85398 }];
      jest.spyOn(userAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: userAccountCollection })));
      const additionalUserAccounts = [userAccount];
      const expectedCollection: IUserAccount[] = [...additionalUserAccounts, ...userAccountCollection];
      jest.spyOn(userAccountService, 'addUserAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(userAccountService.query).toHaveBeenCalled();
      expect(userAccountService.addUserAccountToCollectionIfMissing).toHaveBeenCalledWith(
        userAccountCollection,
        ...additionalUserAccounts.map(expect.objectContaining)
      );
      expect(comp.userAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Organization query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const organization: IOrganization = { id: 39230 };
      event.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 94134 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations.map(expect.objectContaining)
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Venue query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const venue: IVenue = { id: 82046 };
      event.venue = venue;

      const venueCollection: IVenue[] = [{ id: 32322 }];
      jest.spyOn(venueService, 'query').mockReturnValue(of(new HttpResponse({ body: venueCollection })));
      const additionalVenues = [venue];
      const expectedCollection: IVenue[] = [...additionalVenues, ...venueCollection];
      jest.spyOn(venueService, 'addVenueToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(venueService.query).toHaveBeenCalled();
      expect(venueService.addVenueToCollectionIfMissing).toHaveBeenCalledWith(
        venueCollection,
        ...additionalVenues.map(expect.objectContaining)
      );
      expect(comp.venuesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const galery: IGalery = { id: 15503 };
      event.galery = galery;
      const userAccount: IUserAccount = { id: 42219 };
      event.userAccount = userAccount;
      const organization: IOrganization = { id: 87158 };
      event.organization = organization;
      const venue: IVenue = { id: 60531 };
      event.venue = venue;

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(comp.galeriesCollection).toContain(galery);
      expect(comp.userAccountsSharedCollection).toContain(userAccount);
      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.venuesSharedCollection).toContain(venue);
      expect(comp.event).toEqual(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventFormService, 'getEvent').mockReturnValue(event);
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventService.update).toHaveBeenCalledWith(expect.objectContaining(event));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventFormService, 'getEvent').mockReturnValue({ id: null });
      jest.spyOn(eventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(eventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGalery', () => {
      it('Should forward to galeryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(galeryService, 'compareGalery');
        comp.compareGalery(entity, entity2);
        expect(galeryService.compareGalery).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserAccount', () => {
      it('Should forward to userAccountService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userAccountService, 'compareUserAccount');
        comp.compareUserAccount(entity, entity2);
        expect(userAccountService.compareUserAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOrganization', () => {
      it('Should forward to organizationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(organizationService, 'compareOrganization');
        comp.compareOrganization(entity, entity2);
        expect(organizationService.compareOrganization).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVenue', () => {
      it('Should forward to venueService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(venueService, 'compareVenue');
        comp.compareVenue(entity, entity2);
        expect(venueService.compareVenue).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
