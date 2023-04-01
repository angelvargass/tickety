import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserAccount, NewUserAccount } from '../user-account.model';

export type PartialUpdateUserAccount = Partial<IUserAccount> & Pick<IUserAccount, 'id'>;

export type EntityResponseType = HttpResponse<IUserAccount>;
export type EntityArrayResponseType = HttpResponse<IUserAccount[]>;

@Injectable({ providedIn: 'root' })
export class UserAccountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-accounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userAccount: NewUserAccount): Observable<EntityResponseType> {
    return this.http.post<IUserAccount>(this.resourceUrl, userAccount, { observe: 'response' });
  }

  update(userAccount: IUserAccount): Observable<EntityResponseType> {
    return this.http.put<IUserAccount>(`${this.resourceUrl}/${this.getUserAccountIdentifier(userAccount)}`, userAccount, {
      observe: 'response',
    });
  }

  partialUpdate(userAccount: PartialUpdateUserAccount): Observable<EntityResponseType> {
    return this.http.patch<IUserAccount>(`${this.resourceUrl}/${this.getUserAccountIdentifier(userAccount)}`, userAccount, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByUser(id: number | undefined): Observable<EntityResponseType> {
    return this.http.get<IUserAccount>(`${this.resourceUrl}/users/${id}`, { observe: 'response' });
  }

  getUserAccountIdentifier(userAccount: Pick<IUserAccount, 'id'>): number {
    return userAccount.id;
  }

  compareUserAccount(o1: Pick<IUserAccount, 'id'> | null, o2: Pick<IUserAccount, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserAccountIdentifier(o1) === this.getUserAccountIdentifier(o2) : o1 === o2;
  }

  addUserAccountToCollectionIfMissing<Type extends Pick<IUserAccount, 'id'>>(
    userAccountCollection: Type[],
    ...userAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userAccounts: Type[] = userAccountsToCheck.filter(isPresent);
    if (userAccounts.length > 0) {
      const userAccountCollectionIdentifiers = userAccountCollection.map(
        userAccountItem => this.getUserAccountIdentifier(userAccountItem)!
      );
      const userAccountsToAdd = userAccounts.filter(userAccountItem => {
        const userAccountIdentifier = this.getUserAccountIdentifier(userAccountItem);
        if (userAccountCollectionIdentifiers.includes(userAccountIdentifier)) {
          return false;
        }
        userAccountCollectionIdentifiers.push(userAccountIdentifier);
        return true;
      });
      return [...userAccountsToAdd, ...userAccountCollection];
    }
    return userAccountCollection;
  }
}
