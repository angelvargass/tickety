import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GaleryDetailComponent } from './galery-detail.component';

describe('Galery Management Detail Component', () => {
  let comp: GaleryDetailComponent;
  let fixture: ComponentFixture<GaleryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GaleryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ galery: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GaleryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GaleryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load galery on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.galery).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
