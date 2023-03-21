import { IRoles, NewRoles } from './roles.model';

export const sampleWithRequiredData: IRoles = {
  id: 52068,
};

export const sampleWithPartialData: IRoles = {
  id: 50286,
};

export const sampleWithFullData: IRoles = {
  id: 60842,
  type: 'reinvent Negro Austria',
};

export const sampleWithNewData: NewRoles = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
