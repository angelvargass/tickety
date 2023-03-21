import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GaleryFormService } from './galery-form.service';
import { GaleryService } from '../service/galery.service';
import { IGalery } from '../galery.model';

import { GaleryUpdateComponent } from './galery-update.component';

describe('Galery Management Update Component', () => {
  let comp: GaleryUpdateComponent;
  let fixture: ComponentFixture<GaleryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let galeryFormService: GaleryFormService;
  let galeryService: GaleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GaleryUpdateComponent],
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
      .overrideTemplate(GaleryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GaleryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    galeryFormService = TestBed.inject(GaleryFormService);
    galeryService = TestBed.inject(GaleryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const galery: IGalery = { id: 456 };

      activatedRoute.data = of({ galery });
      comp.ngOnInit();

      expect(comp.galery).toEqual(galery);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGalery>>();
      const galery = { id: 123 };
      jest.spyOn(galeryFormService, 'getGalery').mockReturnValue(galery);
      jest.spyOn(galeryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ galery });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: galery }));
      saveSubject.complete();

      // THEN
      expect(galeryFormService.getGalery).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(galeryService.update).toHaveBeenCalledWith(expect.objectContaining(galery));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGalery>>();
      const galery = { id: 123 };
      jest.spyOn(galeryFormService, 'getGalery').mockReturnValue({ id: null });
      jest.spyOn(galeryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ galery: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: galery }));
      saveSubject.complete();

      // THEN
      expect(galeryFormService.getGalery).toHaveBeenCalled();
      expect(galeryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGalery>>();
      const galery = { id: 123 };
      jest.spyOn(galeryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ galery });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(galeryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
