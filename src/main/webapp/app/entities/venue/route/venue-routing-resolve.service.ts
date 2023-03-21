import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVenue } from '../venue.model';
import { VenueService } from '../service/venue.service';

@Injectable({ providedIn: 'root' })
export class VenueRoutingResolveService implements Resolve<IVenue | null> {
  constructor(protected service: VenueService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVenue | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((venue: HttpResponse<IVenue>) => {
          if (venue.body) {
            return of(venue.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
