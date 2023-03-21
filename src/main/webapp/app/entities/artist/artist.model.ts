import { IEvent } from 'app/entities/event/event.model';

export interface IArtist {
  id: number;
  name?: string | null;
  info?: string | null;
  socialMedia?: string | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewArtist = Omit<IArtist, 'id'> & { id: null };
