import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-account.test-samples';

import { UserAccountFormService } from './user-account-form.service';

describe('UserAccount Form Service', () => {
  let service: UserAccountFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAccountFormService);
  });

  describe('Service methods', () => {
    describe('createUserAccountFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserAccountFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            genderu: expect.any(Object),
            organization: expect.any(Object),
          })
        );
      });

      it('passing IUserAccount should create a new form with FormGroup', () => {
        const formGroup = service.createUserAccountFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            genderu: expect.any(Object),
            organization: expect.any(Object),
          })
        );
      });
    });

    describe('getUserAccount', () => {
      it('should return NewUserAccount for default UserAccount initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserAccountFormGroup(sampleWithNewData);

        const userAccount = service.getUserAccount(formGroup) as any;

        expect(userAccount).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserAccount for empty UserAccount initial value', () => {
        const formGroup = service.createUserAccountFormGroup();

        const userAccount = service.getUserAccount(formGroup) as any;

        expect(userAccount).toMatchObject({});
      });

      it('should return IUserAccount', () => {
        const formGroup = service.createUserAccountFormGroup(sampleWithRequiredData);

        const userAccount = service.getUserAccount(formGroup) as any;

        expect(userAccount).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserAccount should not enable id FormControl', () => {
        const formGroup = service.createUserAccountFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserAccount should disable id FormControl', () => {
        const formGroup = service.createUserAccountFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
