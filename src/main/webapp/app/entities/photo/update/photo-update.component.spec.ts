import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PhotoFormService } from './photo-form.service';
import { PhotoService } from '../service/photo.service';
import { IPhoto } from '../photo.model';
import { IGalery } from 'app/entities/galery/galery.model';
import { GaleryService } from 'app/entities/galery/service/galery.service';

import { PhotoUpdateComponent } from './photo-update.component';

describe('Photo Management Update Component', () => {
  let comp: PhotoUpdateComponent;
  let fixture: ComponentFixture<PhotoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let photoFormService: PhotoFormService;
  let photoService: PhotoService;
  let galeryService: GaleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PhotoUpdateComponent],
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
      .overrideTemplate(PhotoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhotoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    photoFormService = TestBed.inject(PhotoFormService);
    photoService = TestBed.inject(PhotoService);
    galeryService = TestBed.inject(GaleryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Galery query and add missing value', () => {
      const photo: IPhoto = { id: 456 };
      const galery: IGalery = { id: 91617 };
      photo.galery = galery;

      const galeryCollection: IGalery[] = [{ id: 64556 }];
      jest.spyOn(galeryService, 'query').mockReturnValue(of(new HttpResponse({ body: galeryCollection })));
      const additionalGaleries = [galery];
      const expectedCollection: IGalery[] = [...additionalGaleries, ...galeryCollection];
      jest.spyOn(galeryService, 'addGaleryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(galeryService.query).toHaveBeenCalled();
      expect(galeryService.addGaleryToCollectionIfMissing).toHaveBeenCalledWith(
        galeryCollection,
        ...additionalGaleries.map(expect.objectContaining)
      );
      expect(comp.galeriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const photo: IPhoto = { id: 456 };
      const galery: IGalery = { id: 53518 };
      photo.galery = galery;

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(comp.galeriesSharedCollection).toContain(galery);
      expect(comp.photo).toEqual(photo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhoto>>();
      const photo = { id: 123 };
      jest.spyOn(photoFormService, 'getPhoto').mockReturnValue(photo);
      jest.spyOn(photoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: photo }));
      saveSubject.complete();

      // THEN
      expect(photoFormService.getPhoto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(photoService.update).toHaveBeenCalledWith(expect.objectContaining(photo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhoto>>();
      const photo = { id: 123 };
      jest.spyOn(photoFormService, 'getPhoto').mockReturnValue({ id: null });
      jest.spyOn(photoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ photo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: photo }));
      saveSubject.complete();

      // THEN
      expect(photoFormService.getPhoto).toHaveBeenCalled();
      expect(photoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhoto>>();
      const photo = { id: 123 };
      jest.spyOn(photoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(photoService.update).toHaveBeenCalled();
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
  });
});
