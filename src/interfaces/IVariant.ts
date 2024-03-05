import { IImage } from './IImage';

export interface IVariant {
  id: number;
  title: string;
  option1: string;
  option2: string;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: IImage;
  available: boolean;
  price: string;
  grams: number;
  compare_at_price: string | null;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}
