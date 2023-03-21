import dayjs from 'dayjs/esm';
import { IEvent } from 'app/entities/event/event.model';
import { TicketStatus } from 'app/entities/enumerations/ticket-status.model';

export interface ITicket {
  id: number;
  date?: dayjs.Dayjs | null;
  ticketStatus?: TicketStatus | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewTicket = Omit<ITicket, 'id'> & { id: null };
