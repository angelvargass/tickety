import { IUserAccount } from 'app/entities/user-account/user-account.model';

export interface IRoles {
  id: number;
  type?: string | null;
  userAccount?: Pick<IUserAccount, 'id'> | null;
}

export type NewRoles = Omit<IRoles, 'id'> & { id: null };
