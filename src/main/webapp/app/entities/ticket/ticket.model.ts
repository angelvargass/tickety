import dayjs from 'dayjs/esm';
import { IEvent } from 'app/entities/event/event.model';
import { TicketStatus } from 'app/entities/enumerations/ticket-status.model';
import { IUserAccount } from '../user-account/user-account.model';

export interface ITicket {
  id: number;
  date?: dayjs.Dayjs | null;
  ticketStatus?: TicketStatus | null;
  payment?: string | null;
  amount?: number | null;
  seat?: string | null;
  userAccount?: Pick<IUserAccount, 'id'> | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewTicket = Omit<ITicket, 'id'> & { id: null };
