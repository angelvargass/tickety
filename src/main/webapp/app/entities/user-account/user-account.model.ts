import { IOrganization } from 'app/entities/organization/organization.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { Account } from '../../core/auth/account.model';

export interface IUserAccount {
  id: number;
  genderu?: Gender | null;
  organization?: Pick<IOrganization, 'id'> | null;
  user?: Account | null;
}

export type NewUserAccount = Omit<IUserAccount, 'id'> & { id: null };
