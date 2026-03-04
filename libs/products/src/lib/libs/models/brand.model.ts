export interface Brand {
  id?: string;
  name: string;
  logo: string;
  description?: string;
  featured?: boolean;
  order?: number;
  dateCreated?: Date;
}
