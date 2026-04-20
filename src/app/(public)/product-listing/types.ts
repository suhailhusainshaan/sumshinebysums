export interface ProductListingReference {
  id: number;
  name: string;
  slug: string;
}

export interface ProductListingImage {
  id: number;
  url: string;
  altText: string | null;
  featured: boolean;
}

export interface ProductListingVariant {
  id: number;
  sku: string;
  name: string | null;
  price: number;
  comparePrice: number | null;
  stockQuantity: number | null;
  active: boolean;
}

export interface ProductListingItem {
  id: number;
  name: string;
  slug: string;
  brand: ProductListingReference | null;
  category: ProductListingReference | null;
  price: number;
  comparePrice: number | null;
  thumbnail: string | null;
  images: ProductListingImage[];
  isFeatured: boolean;
  isActive: boolean;
  variants: ProductListingVariant[];
}

export interface ProductFilterOption {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface ProductFiltersResponse {
  categories: ProductFilterOption[];
  brands: ProductFilterOption[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface ProductListingResponse {
  content: ProductListingItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ProductListingQuery {
  page: number;
  limit: number;
  sort: 'popular' | 'latest' | 'price_asc' | 'price_desc';
  categoryId: string | null;
  brandId: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  q: string | null;
}
