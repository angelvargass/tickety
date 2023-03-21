import { IOrganization } from 'app/entities/organization/organization.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IUserAccount {
  id: number;
  email?: string | null;
  password?: string | null;
  name?: string | null;
  lastName?: string | null;
  genderu?: Gender | null;
  organization?: Pick<IOrganization, 'id'> | null;
}

export type NewUserAccount = Omit<IUserAccount, 'id'> & { id: null };
