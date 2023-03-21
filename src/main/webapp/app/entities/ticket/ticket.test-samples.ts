import dayjs from 'dayjs/esm';

import { TicketStatus } from 'app/entities/enumerations/ticket-status.model';

import { ITicket, NewTicket } from './ticket.model';

export const sampleWithRequiredData: ITicket = {
  id: 65582,
};

export const sampleWithPartialData: ITicket = {
  id: 47683,
  date: dayjs('2023-03-20'),
};

export const sampleWithFullData: ITicket = {
  id: 23104,
  date: dayjs('2023-03-21'),
  ticketStatus: TicketStatus['PENDING'],
};

export const sampleWithNewData: NewTicket = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
