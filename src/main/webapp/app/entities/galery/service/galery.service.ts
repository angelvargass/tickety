import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGalery, NewGalery } from '../galery.model';

export type PartialUpdateGalery = Partial<IGalery> & Pick<IGalery, 'id'>;

export type EntityResponseType = HttpResponse<IGalery>;
export type EntityArrayResponseType = HttpResponse<IGalery[]>;

@Injectable({ providedIn: 'root' })
export class GaleryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/galeries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(galery: NewGalery): Observable<EntityResponseType> {
    return this.http.post<IGalery>(this.resourceUrl, galery, { observe: 'response' });
  }

  update(galery: IGalery): Observable<EntityResponseType> {
    return this.http.put<IGalery>(`${this.resourceUrl}/${this.getGaleryIdentifier(galery)}`, galery, { observe: 'response' });
  }

  partialUpdate(galery: PartialUpdateGalery): Observable<EntityResponseType> {
    return this.http.patch<IGalery>(`${this.resourceUrl}/${this.getGaleryIdentifier(galery)}`, galery, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGalery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGalery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGaleryIdentifier(galery: Pick<IGalery, 'id'>): number {
    return galery.id;
  }

  compareGalery(o1: Pick<IGalery, 'id'> | null, o2: Pick<IGalery, 'id'> | null): boolean {
    return o1 && o2 ? this.getGaleryIdentifier(o1) === this.getGaleryIdentifier(o2) : o1 === o2;
  }

  addGaleryToCollectionIfMissing<Type extends Pick<IGalery, 'id'>>(
    galeryCollection: Type[],
    ...galeriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const galeries: Type[] = galeriesToCheck.filter(isPresent);
    if (galeries.length > 0) {
      const galeryCollectionIdentifiers = galeryCollection.map(galeryItem => this.getGaleryIdentifier(galeryItem)!);
      const galeriesToAdd = galeries.filter(galeryItem => {
        const galeryIdentifier = this.getGaleryIdentifier(galeryItem);
        if (galeryCollectionIdentifiers.includes(galeryIdentifier)) {
          return false;
        }
        galeryCollectionIdentifiers.push(galeryIdentifier);
        return true;
      });
      return [...galeriesToAdd, ...galeryCollection];
    }
    return galeryCollection;
  }
}
