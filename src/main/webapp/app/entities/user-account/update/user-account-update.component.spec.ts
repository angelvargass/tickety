import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserAccountFormService } from './user-account-form.service';
import { UserAccountService } from '../service/user-account.service';
import { IUserAccount } from '../user-account.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { UserAccountUpdateComponent } from './user-account-update.component';

describe('UserAccount Management Update Component', () => {
  let comp: UserAccountUpdateComponent;
  let fixture: ComponentFixture<UserAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userAccountFormService: UserAccountFormService;
  let userAccountService: UserAccountService;
  let organizationService: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserAccountUpdateComponent],
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
      .overrideTemplate(UserAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userAccountFormService = TestBed.inject(UserAccountFormService);
    userAccountService = TestBed.inject(UserAccountService);
    organizationService = TestBed.inject(OrganizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const userAccount: IUserAccount = { id: 456 };
      const organization: IOrganization = { id: 29497 };
      userAccount.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 36448 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userAccount });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations.map(expect.objectContaining)
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userAccount: IUserAccount = { id: 456 };
      const organization: IOrganization = { id: 50949 };
      userAccount.organization = organization;

      activatedRoute.data = of({ userAccount });
      comp.ngOnInit();

      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.userAccount).toEqual(userAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserAccount>>();
      const userAccount = { id: 123 };
      jest.spyOn(userAccountFormService, 'getUserAccount').mockReturnValue(userAccount);
      jest.spyOn(userAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userAccount }));
      saveSubject.complete();

      // THEN
      expect(userAccountFormService.getUserAccount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userAccountService.update).toHaveBeenCalledWith(expect.objectContaining(userAccount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserAccount>>();
      const userAccount = { id: 123 };
      jest.spyOn(userAccountFormService, 'getUserAccount').mockReturnValue({ id: null });
      jest.spyOn(userAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userAccount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userAccount }));
      saveSubject.complete();

      // THEN
      expect(userAccountFormService.getUserAccount).toHaveBeenCalled();
      expect(userAccountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserAccount>>();
      const userAccount = { id: 123 };
      jest.spyOn(userAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userAccountService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrganization', () => {
      it('Should forward to organizationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(organizationService, 'compareOrganization');
        comp.compareOrganization(entity, entity2);
        expect(organizationService.compareOrganization).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
