export interface WishlistItem {
  id: number;
  productId: number;
  variantId: number | null;
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    isPublished: boolean;
    isActive: boolean;
    brandId: number;
    categoryId: number;
  };
  variant: {
    id: number;
    sku: string;
    name: string;
    price: number;
    compareAtPrice: number;
    stockQuantity: number;
    isActive: boolean;
  } | null;
  productImages: {
    imageUrl: string;
    altText: string;
    isFeatureImage: boolean;
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
