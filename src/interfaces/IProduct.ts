import { IImage } from './IImage';
import { IVariant } from './IVariant';

export interface IProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: IVariant[];
  images: IImage[];
}
