import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GaleryService } from '../service/galery.service';

import { GaleryComponent } from './galery.component';

describe('Galery Management Component', () => {
  let comp: GaleryComponent;
  let fixture: ComponentFixture<GaleryComponent>;
  let service: GaleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'galery', component: GaleryComponent }]), HttpClientTestingModule],
      declarations: [GaleryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(GaleryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GaleryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GaleryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.galeries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to galeryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGaleryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGaleryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
