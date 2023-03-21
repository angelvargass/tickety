import { IGenre, NewGenre } from './genre.model';

export const sampleWithRequiredData: IGenre = {
  id: 52824,
};

export const sampleWithPartialData: IGenre = {
  id: 78873,
  form: 'Avon',
  type: 'fritas Pescado Account',
};

export const sampleWithFullData: IGenre = {
  id: 93527,
  form: 'deposit card',
  type: 'Vasco Corporativo',
};

export const sampleWithNewData: NewGenre = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
