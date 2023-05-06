import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EventService } from '../service/event.service';

import { GlobalDashboardsComponent } from './global-dashboards.component';

describe('Event Management Component', () => {
  let comp: GlobalDashboardsComponent;
  let fixture: ComponentFixture<GlobalDashboardsComponent>;
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'event', component: GlobalDashboardsComponent }]), HttpClientTestingModule],
      declarations: [GlobalDashboardsComponent],
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
      .overrideTemplate(GlobalDashboardsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GlobalDashboardsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventService);

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
    expect(comp.events?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to eventService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEventIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEventIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
