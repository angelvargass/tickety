import { IArtist } from 'app/entities/artist/artist.model';

export interface IGenre {
  id: number;
  form?: string | null;
  type?: string | null;
  artist?: Pick<IArtist, 'id'> | null;
}

export type NewGenre = Omit<IGenre, 'id'> & { id: null };
