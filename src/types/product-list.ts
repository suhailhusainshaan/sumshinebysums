// Define the nested structures first
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string;
  featureImage: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  images: ProductImage[];
  published: boolean;
  features: Record<string, any>;
  specifications: Record<string, any>;
}

// This matches the Pageable JSON structure from Spring Boot
export interface PaginatedProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page index
  first: boolean;
  last: boolean;
}
