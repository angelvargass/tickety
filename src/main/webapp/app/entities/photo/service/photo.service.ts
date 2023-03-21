import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhoto, NewPhoto } from '../photo.model';

export type PartialUpdatePhoto = Partial<IPhoto> & Pick<IPhoto, 'id'>;

export type EntityResponseType = HttpResponse<IPhoto>;
export type EntityArrayResponseType = HttpResponse<IPhoto[]>;

@Injectable({ providedIn: 'root' })
export class PhotoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/photos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(photo: NewPhoto): Observable<EntityResponseType> {
    return this.http.post<IPhoto>(this.resourceUrl, photo, { observe: 'response' });
  }

  update(photo: IPhoto): Observable<EntityResponseType> {
    return this.http.put<IPhoto>(`${this.resourceUrl}/${this.getPhotoIdentifier(photo)}`, photo, { observe: 'response' });
  }

  partialUpdate(photo: PartialUpdatePhoto): Observable<EntityResponseType> {
    return this.http.patch<IPhoto>(`${this.resourceUrl}/${this.getPhotoIdentifier(photo)}`, photo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPhoto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPhoto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPhotoIdentifier(photo: Pick<IPhoto, 'id'>): number {
    return photo.id;
  }

  comparePhoto(o1: Pick<IPhoto, 'id'> | null, o2: Pick<IPhoto, 'id'> | null): boolean {
    return o1 && o2 ? this.getPhotoIdentifier(o1) === this.getPhotoIdentifier(o2) : o1 === o2;
  }

  addPhotoToCollectionIfMissing<Type extends Pick<IPhoto, 'id'>>(
    photoCollection: Type[],
    ...photosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const photos: Type[] = photosToCheck.filter(isPresent);
    if (photos.length > 0) {
      const photoCollectionIdentifiers = photoCollection.map(photoItem => this.getPhotoIdentifier(photoItem)!);
      const photosToAdd = photos.filter(photoItem => {
        const photoIdentifier = this.getPhotoIdentifier(photoItem);
        if (photoCollectionIdentifiers.includes(photoIdentifier)) {
          return false;
        }
        photoCollectionIdentifiers.push(photoIdentifier);
        return true;
      });
      return [...photosToAdd, ...photoCollection];
    }
    return photoCollection;
  }
}
