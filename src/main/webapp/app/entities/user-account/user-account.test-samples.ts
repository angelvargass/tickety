import { Gender } from 'app/entities/enumerations/gender.model';

import { IUserAccount, NewUserAccount } from './user-account.model';

export const sampleWithRequiredData: IUserAccount = {
  id: 44330,
};

export const sampleWithPartialData: IUserAccount = {
  id: 51794,
};

export const sampleWithFullData: IUserAccount = {
  id: 40806,
  genderu: Gender['FEMENINO'],
};

export const sampleWithNewData: NewUserAccount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
