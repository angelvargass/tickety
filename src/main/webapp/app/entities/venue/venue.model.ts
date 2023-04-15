export interface IVenue {
  id: number;
  name?: string | null;
  description?: string | null;
  address?: string | null;
  coordinates?: string | null;
  photoUrl?: string | null;
  capacity?: number | null;
}

export type NewVenue = Omit<IVenue, 'id'> & { id: null };
