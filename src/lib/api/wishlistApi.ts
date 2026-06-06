import api from '@/lib/axios';
import { getOrCreateGuestToken, clearGuestToken } from '@/lib/wishlistCookie';
import { getAuthToken } from '@/lib/wishlistHeaders';
import {
  WishlistItem,
  WishlistCheckResponse,
  WishlistMergeResponse,
  WishlistClearResponse,
  WishlistApiResponse,
} from '@/types/wishlist';

function headers(): Record<string, string> {
  const auth = getAuthToken();
  if (auth) return { Authorization: `Bearer ${auth}` };
  return { 'X-Guest-Token': getOrCreateGuestToken() };
}

interface WishlistListResponse {
  items: WishlistItem[];
  totalCount: number;
}

export const getWishlist = (): Promise<WishlistApiResponse<WishlistListResponse>> =>
  api.get('/v1/wishlist', { headers: headers() }).then((r) => r.data);

export const addToWishlist = (
  productId: number,
  variantId?: number
): Promise<WishlistApiResponse<WishlistItem>> =>
  api.post('/v1/wishlist', { productId, variantId }, { headers: headers() }).then((r) => r.data);

export const removeFromWishlist = (itemId: number): Promise<WishlistApiResponse<null>> =>
  api.delete(`/v1/wishlist/${itemId}`, { headers: headers() }).then((r) => r.data);

export const checkWishlisted = (
  productId: number,
  variantId?: number
): Promise<WishlistApiResponse<WishlistCheckResponse>> =>
  api
    .get('/v1/wishlist/check', {
      params: { productId, variantId },
      headers: headers(),
    })
    .then((r) => r.data);

export const mergeWishlist = (
  guestToken: string
): Promise<WishlistApiResponse<WishlistMergeResponse>> =>
  api.post('/v1/wishlist/merge', { guestToken }, { headers: headers() }).then((r) => {
    clearGuestToken();
    return r.data;
  });

export const clearWishlist = (): Promise<WishlistApiResponse<WishlistClearResponse>> =>
  api.delete('/v1/wishlist', { headers: headers() }).then((r) => r.data);
