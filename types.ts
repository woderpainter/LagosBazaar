export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  shortDescription: string;
  fullDescription?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewState = 'HOME' | 'PRODUCT_DETAILS' | 'CHECKOUT' | 'CATEGORY';

export interface AIResponse {
  salesPitch: string;
  keyFeatures: string[];
  seoTags: string[];
}
