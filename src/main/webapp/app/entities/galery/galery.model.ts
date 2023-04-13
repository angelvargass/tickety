import { GaleryStatus } from 'app/entities/enumerations/galery-status.model';
import { IPhoto } from '../photo/photo.model';
import { IEvent } from '../event/event.model';

export interface IGalery {
  id: number;
  name?: string | null;
  status?: GaleryStatus | null;
  photos?: Pick<IPhoto, 'id'> | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewGalery = Omit<IGalery, 'id'> & { id: null };
