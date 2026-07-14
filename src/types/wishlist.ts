export interface WishlistItem {
  id: number;
  productId: number;
  variantId: number | null;
  name: string;
  slug: string;
  description: string;
  brandId: number;
  brandName: string | null;
  brandSlug: string | null;
  categoryId: number;
  categoryName: string | null;
  categorySlug: string | null;
  thumbnail: string | null;
  inStock: boolean;
  available: boolean;
  discountPercentage: number;
  published: boolean;
  active: boolean;
  variant: {
    id: number;
    sku: string;
    name: string;
    price: number;
    compareAtPrice: number;
    stockQuantity: number;
    active: boolean;
  } | null;
  images: {
    id: number;
    imageUrl: string;
    altText: string;
    featureImage: boolean;
    variantId: number;
    productId: number;
  }[];
  createdAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

export interface WishlistCheckResponse {
  wishlisted: boolean;
  wishlistItemId?: number;
}

export interface WishlistMergeResponse {
  mergedCount: number;
}

export interface WishlistClearResponse {
  deletedCount: number;
}

export interface WishlistApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}
