export interface IContact {
  id: number;
  phone?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
}

export type NewContact = Omit<IContact, 'id'> & { id: null };
