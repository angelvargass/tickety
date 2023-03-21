import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RolesFormService } from './roles-form.service';
import { RolesService } from '../service/roles.service';
import { IRoles } from '../roles.model';
import { IUserAccount } from 'app/entities/user-account/user-account.model';
import { UserAccountService } from 'app/entities/user-account/service/user-account.service';

import { RolesUpdateComponent } from './roles-update.component';

describe('Roles Management Update Component', () => {
  let comp: RolesUpdateComponent;
  let fixture: ComponentFixture<RolesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rolesFormService: RolesFormService;
  let rolesService: RolesService;
  let userAccountService: UserAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RolesUpdateComponent],
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
      .overrideTemplate(RolesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RolesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rolesFormService = TestBed.inject(RolesFormService);
    rolesService = TestBed.inject(RolesService);
    userAccountService = TestBed.inject(UserAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserAccount query and add missing value', () => {
      const roles: IRoles = { id: 456 };
      const userAccount: IUserAccount = { id: 29469 };
      roles.userAccount = userAccount;

      const userAccountCollection: IUserAccount[] = [{ id: 19799 }];
      jest.spyOn(userAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: userAccountCollection })));
      const additionalUserAccounts = [userAccount];
      const expectedCollection: IUserAccount[] = [...additionalUserAccounts, ...userAccountCollection];
      jest.spyOn(userAccountService, 'addUserAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      expect(userAccountService.query).toHaveBeenCalled();
      expect(userAccountService.addUserAccountToCollectionIfMissing).toHaveBeenCalledWith(
        userAccountCollection,
        ...additionalUserAccounts.map(expect.objectContaining)
      );
      expect(comp.userAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const roles: IRoles = { id: 456 };
      const userAccount: IUserAccount = { id: 47048 };
      roles.userAccount = userAccount;

      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      expect(comp.userAccountsSharedCollection).toContain(userAccount);
      expect(comp.roles).toEqual(roles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoles>>();
      const roles = { id: 123 };
      jest.spyOn(rolesFormService, 'getRoles').mockReturnValue(roles);
      jest.spyOn(rolesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roles }));
      saveSubject.complete();

      // THEN
      expect(rolesFormService.getRoles).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rolesService.update).toHaveBeenCalledWith(expect.objectContaining(roles));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoles>>();
      const roles = { id: 123 };
      jest.spyOn(rolesFormService, 'getRoles').mockReturnValue({ id: null });
      jest.spyOn(rolesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roles: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roles }));
      saveSubject.complete();

      // THEN
      expect(rolesFormService.getRoles).toHaveBeenCalled();
      expect(rolesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoles>>();
      const roles = { id: 123 };
      jest.spyOn(rolesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rolesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserAccount', () => {
      it('Should forward to userAccountService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userAccountService, 'compareUserAccount');
        comp.compareUserAccount(entity, entity2);
        expect(userAccountService.compareUserAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
