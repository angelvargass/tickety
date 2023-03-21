export interface IVenue {
  id: number;
  address?: string | null;
  capacity?: number | null;
}

export type NewVenue = Omit<IVenue, 'id'> & { id: null };
