/** Shared, browser-safe types for the Brolexy catalog integration. */

export interface BrolexyProduct {
  productId: number;
  category: string;
  region: string;
  name: string;
  price: string;
  priceCurrency: string;
  inStock: number;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  category: string;
  region: string;
  price: number;
  currency: string;
  inStock: number;
  live: boolean;
}
