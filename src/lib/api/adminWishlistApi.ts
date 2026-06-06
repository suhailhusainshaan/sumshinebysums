import api from '@/lib/axios';
import { getAuthToken } from '@/lib/wishlistHeaders';
import { WishlistApiResponse } from '@/types/wishlist';

interface AdminWishlistItem {
  id: number;
  userId?: number;
  userEmail?: string;
  guestToken?: string;
  productId: number;
  productName: string;
  variantId: number | null;
  variantName: string | null;
  variantSku: string | null;
  createdAt: string;
}

interface AdminWishlistListResponse {
  items: AdminWishlistItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

interface AdminWishlistStats {
  totalItems: number;
  totalUsers: number;
  totalGuests: number;
  topWishlistedProducts: {
    productId: number;
    productName: string;
    count: number;
  }[];
}

const adminHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return { Authorization: `Bearer ${token || ''}` };
};

export const adminGetWishlist = (
  params: Record<string, unknown>
): Promise<WishlistApiResponse<AdminWishlistListResponse>> =>
  api
    .get('/api/v1/admin/wishlist', { params, headers: adminHeaders() })
    .then((r) => r.data);

export const adminGetWishlistStats = (): Promise<WishlistApiResponse<AdminWishlistStats>> =>
  api.get('/api/v1/admin/wishlist/stats', { headers: adminHeaders() }).then((r) => r.data);
