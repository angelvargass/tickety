import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserAccountService } from '../service/user-account.service';

import { UserAccountComponent } from './user-account.component';

describe('UserAccount Management Component', () => {
  let comp: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;
  let service: UserAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-account', component: UserAccountComponent }]), HttpClientTestingModule],
      declarations: [UserAccountComponent],
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
      .overrideTemplate(UserAccountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserAccountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserAccountService);

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
    expect(comp.userAccounts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userAccountService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserAccountIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserAccountIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
