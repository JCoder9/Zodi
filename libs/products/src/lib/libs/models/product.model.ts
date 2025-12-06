import { Category } from './category.model';

export class Product {
  id?: string;
  name?: string;
  description?: string;
  richDescription?: string;
  colour?: string;
  image?: string;
  images?: string[];
  brand?: string;
  price?: number;
  originalPrice?: number; // For clearance items
  category?: Category;
  countInStock?: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: string;
  arrivalDate?: Date; // For new-in items
  isNew?: boolean; // For new-in items
}
