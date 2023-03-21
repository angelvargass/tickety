import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VenueDetailComponent } from './venue-detail.component';

describe('Venue Management Detail Component', () => {
  let comp: VenueDetailComponent;
  let fixture: ComponentFixture<VenueDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenueDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ venue: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VenueDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VenueDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load venue on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.venue).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
