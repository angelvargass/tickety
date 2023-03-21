import { IArtist, NewArtist } from './artist.model';

export const sampleWithRequiredData: IArtist = {
  id: 70921,
};

export const sampleWithPartialData: IArtist = {
  id: 90325,
  name: 'best-of-breed de',
  info: 'SQL Navarra',
  socialMedia: 'driver Operaciones Avon',
};

export const sampleWithFullData: IArtist = {
  id: 77325,
  name: 'Guantes Música',
  info: 'Inversor engage',
  socialMedia: 'up Práctico paradigma',
};

export const sampleWithNewData: NewArtist = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
