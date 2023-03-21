import { IContact, NewContact } from './contact.model';

export const sampleWithRequiredData: IContact = {
  id: 36482,
};

export const sampleWithPartialData: IContact = {
  id: 25447,
  instagram: 'parse',
};

export const sampleWithFullData: IContact = {
  id: 84461,
  phone: '958080336',
  instagram: 'incremental navigate Supervisor',
  facebook: 'Berkshire',
  whatsapp: 'Inverso Senior capacitor',
};

export const sampleWithNewData: NewContact = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
