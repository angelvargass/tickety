import { IVenue, NewVenue } from './venue.model';

export const sampleWithRequiredData: IVenue = {
  id: 51080,
};

export const sampleWithPartialData: IVenue = {
  id: 33516,
  capacity: 12606,
};

export const sampleWithFullData: IVenue = {
  id: 84281,
  address: 'Bermuda Uruguay Ruble',
  capacity: 62563,
};

export const sampleWithNewData: NewVenue = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
