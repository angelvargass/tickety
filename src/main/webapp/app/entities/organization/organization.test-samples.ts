import { IOrganization, NewOrganization } from './organization.model';

export const sampleWithRequiredData: IOrganization = {
  id: 12784,
};

export const sampleWithPartialData: IOrganization = {
  id: 4316,
  name: 'Rial Maldivas Navarra',
};

export const sampleWithFullData: IOrganization = {
  id: 27486,
  name: 'Andalucía quantify systems',
  owner: 'withdrawal invoice invoice',
};

export const sampleWithNewData: NewOrganization = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
