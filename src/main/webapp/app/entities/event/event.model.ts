import dayjs from 'dayjs/esm';
import { IGalery } from 'app/entities/galery/galery.model';
import { IUserAccount } from 'app/entities/user-account/user-account.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { IVenue } from 'app/entities/venue/venue.model';
import { EventSatus } from 'app/entities/enumerations/event-satus.model';

export interface IEvent {
  id: number;
  date?: dayjs.Dayjs | null;
  eventSatus?: EventSatus | null;
  talTickets?: number | null;
  eventPrice?: number | null;
  eventName?: string | null;
  eventDescription?: string | null;
  galery?: Pick<IGalery, 'id'> | null;
  userAccount?: Pick<IUserAccount, 'id'> | null;
  organization?: Pick<IOrganization, 'id'> | null;
  venue?: Pick<IVenue, 'id' | 'name'> | null;
  // this is only use for showing the main image for the event
  showCase?: string | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
