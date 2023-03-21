import { GaleryStatus } from 'app/entities/enumerations/galery-status.model';

export interface IGalery {
  id: number;
  name?: string | null;
  status?: GaleryStatus | null;
}

export type NewGalery = Omit<IGalery, 'id'> & { id: null };
