import { IGalery } from 'app/entities/galery/galery.model';
import { PhotoStatus } from 'app/entities/enumerations/photo-status.model';

export interface IPhoto {
  id: number;
  url?: string | null;
  status?: PhotoStatus | null;
  galery?: Pick<IGalery, 'id'> | null;
}

export type NewPhoto = Omit<IPhoto, 'id'> & { id: null };
