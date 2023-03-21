import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGalery } from '../galery.model';
import { GaleryService } from '../service/galery.service';

@Injectable({ providedIn: 'root' })
export class GaleryRoutingResolveService implements Resolve<IGalery | null> {
  constructor(protected service: GaleryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGalery | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((galery: HttpResponse<IGalery>) => {
          if (galery.body) {
            return of(galery.body);
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
