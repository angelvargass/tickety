import { IContact } from 'app/entities/contact/contact.model';

export interface IOrganization {
  id: number;
  name?: string | null;
  owner?: string | null;
  contact?: Pick<IContact, 'id'> | null;
}

export type NewOrganization = Omit<IOrganization, 'id'> & { id: null };
