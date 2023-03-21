import { Gender } from 'app/entities/enumerations/gender.model';

import { IUserAccount, NewUserAccount } from './user-account.model';

export const sampleWithRequiredData: IUserAccount = {
  id: 44330,
};

export const sampleWithPartialData: IUserAccount = {
  id: 64582,
  password: 'invoice',
  lastName: 'Delagarza',
  genderu: Gender['OTRO'],
};

export const sampleWithFullData: IUserAccount = {
  id: 20582,
  email: 'Santiago.Soliz11@yahoo.com',
  password: 'Papelería León Seguro',
  name: 'bandwidth Parque',
  lastName: 'Granados',
  genderu: Gender['MASCULINO'],
};

export const sampleWithNewData: NewUserAccount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
