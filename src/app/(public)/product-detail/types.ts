export interface ProductDetailReference {
  id: number;
  name: string;
  slug: string;
}

export interface ProductDetailImage {
  id: number;
  url: string;
  altText: string | null;
  featured: boolean;
}

export interface ProductDetailVariant {
  id: number;
  sku: string;
  name: string | null;
  price: number;
  comparePrice: number | null;
  stockQuantity: number | null;
  active: boolean;
  thumbnail: string | null;
  images: ProductDetailImage[];
}

export interface ProductDetailResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  brand: ProductDetailReference | null;
  category: ProductDetailReference | null;
  price: number;
  comparePrice: number | null;
  thumbnail: string | null;
  images: ProductDetailImage[];
  isFeatured: boolean;
  isActive: boolean;
  isPublished: boolean;
  features: Record<string, unknown> | null;
  specifications: Record<string, unknown> | null;
  variants: ProductDetailVariant[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface RelatedProductResponse {
  id: number;
  name: string;
  slug: string;
  brand: ProductDetailReference | null;
  category: ProductDetailReference | null;
  price: number;
  comparePrice: number | null;
  thumbnail: string | null;
  images: ProductDetailImage[];
  isFeatured: boolean;
  isActive: boolean;
  variants: ProductDetailVariant[];
}
