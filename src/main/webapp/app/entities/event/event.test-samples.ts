import dayjs from 'dayjs/esm';

import { EventSatus } from 'app/entities/enumerations/event-satus.model';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
};

export const sampleWithPartialData: IEvent = {
  id: 43735,
  talTickets: 62921,
};

export const sampleWithFullData: IEvent = {
  id: 49201,
  date: dayjs('2023-03-20'),
  eventSatus: EventSatus['OPEN'],
  talTickets: 2671,
};

export const sampleWithNewData: NewEvent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
