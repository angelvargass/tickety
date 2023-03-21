import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../galery.test-samples';

import { GaleryFormService } from './galery-form.service';

describe('Galery Form Service', () => {
  let service: GaleryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GaleryFormService);
  });

  describe('Service methods', () => {
    describe('createGaleryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGaleryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });

      it('passing IGalery should create a new form with FormGroup', () => {
        const formGroup = service.createGaleryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });
    });

    describe('getGalery', () => {
      it('should return NewGalery for default Galery initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGaleryFormGroup(sampleWithNewData);

        const galery = service.getGalery(formGroup) as any;

        expect(galery).toMatchObject(sampleWithNewData);
      });

      it('should return NewGalery for empty Galery initial value', () => {
        const formGroup = service.createGaleryFormGroup();

        const galery = service.getGalery(formGroup) as any;

        expect(galery).toMatchObject({});
      });

      it('should return IGalery', () => {
        const formGroup = service.createGaleryFormGroup(sampleWithRequiredData);

        const galery = service.getGalery(formGroup) as any;

        expect(galery).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGalery should not enable id FormControl', () => {
        const formGroup = service.createGaleryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGalery should disable id FormControl', () => {
        const formGroup = service.createGaleryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
