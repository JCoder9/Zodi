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
  price?: number; // Current selling price (discounted if on sale)
  originalPrice?: number; // Regular price (for showing discount)
  onSale?: boolean; // Sale flag
  isClearance?: boolean; // Clearance flag
  discountPercentage?: number; // Discount percentage (can be calculated)
  category?: Category;
  productType?: string; // 'Shoes' | 'Handbags' | 'Accessories' | 'Clothing'
  size?: string[]; // ['7', '8', '9'] or ['S', 'M', 'L']
  heelType?: string; // 'Flat' | 'Low Heel' | 'Mid Heel' | 'High Heel' | 'Platform' | 'Wedge'
  countInStock?: number;
  inStock?: boolean; // Boolean stock status
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  isNew?: boolean; // For new-in items
  dateCreated?: string;
  arrivalDate?: Date; // For new-in items
}
