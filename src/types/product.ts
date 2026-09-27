export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  count: number;
  status?: 'active' | 'hidden';
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductStatus = 'published' | 'draft' | 'hidden' | 'archived';

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviews: number;
  stock: number;
  status?: ProductStatus;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  season?: string;
  createdAt?: string;
  updatedAt?: string;
}
