import { GaleryStatus } from 'app/entities/enumerations/galery-status.model';

import { IGalery, NewGalery } from './galery.model';

export const sampleWithRequiredData: IGalery = {
  id: 90474,
};

export const sampleWithPartialData: IGalery = {
  id: 42021,
  status: GaleryStatus['ACTIVE'],
};

export const sampleWithFullData: IGalery = {
  id: 86809,
  name: 'Gorro Rojo',
  status: GaleryStatus['INSTACTIVE'],
};

export const sampleWithNewData: NewGalery = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
