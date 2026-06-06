import { create } from 'zustand';
import { WishlistItem, WishlistState } from '@/types/wishlist';
import * as wishlistApi from '@/lib/api/wishlistApi';
import { getGuestToken } from '@/lib/wishlistCookie';

interface WishlistStore extends WishlistState {
  fetchWishlist: () => Promise<void>;
  addItem: (productId: number, variantId?: number) => Promise<void>;
  removeItem: (wishlistItemId: number) => Promise<void>;
  mergeGuestWishlist: (guestToken: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isWishlisted: (productId: number, variantId?: number) => boolean;
  getWishlistItemId: (productId: number, variantId?: number) => number | undefined;
  initialize: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  totalCount: 0,
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const res = await wishlistApi.getWishlist();
      if (res.status) {
        set({
          items: res.data.items,
          totalCount: res.data.totalCount,
          loading: false,
        });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch wishlist', loading: false });
    }
  },

  addItem: async (productId: number, variantId?: number) => {
    const res = await wishlistApi.addToWishlist(productId, variantId);
    if (res.status) {
      set((state) => ({
        items: [...state.items, res.data],
        totalCount: state.totalCount + 1,
      }));
    } else {
      throw new Error(res.message);
    }
  },

  removeItem: async (wishlistItemId: number) => {
    const res = await wishlistApi.removeFromWishlist(wishlistItemId);
    if (res.status) {
      set((state) => ({
        items: state.items.filter((i) => i.id !== wishlistItemId),
        totalCount: state.totalCount - 1,
      }));
    } else {
      throw new Error(res.message);
    }
  },

  mergeGuestWishlist: async (guestToken: string) => {
    try {
      await wishlistApi.mergeWishlist(guestToken);
      await get().fetchWishlist();
    } catch (e: any) {
      console.error('Failed to merge guest wishlist:', e);
      throw e;
    }
  },

  clearWishlist: async () => {
    try {
      const res = await wishlistApi.clearWishlist();
      if (res.status) {
        set({ items: [], totalCount: 0 });
      }
    } catch (e: any) {
      console.error('Failed to clear wishlist:', e);
      throw e;
    }
  },

  isWishlisted: (productId: number, variantId?: number) => {
    return get().items.some(
      (i) => i.productId === productId && i.variantId === (variantId ?? null)
    );
  },

  getWishlistItemId: (productId: number, variantId?: number) => {
    const item = get().items.find(
      (i) => i.productId === productId && i.variantId === (variantId ?? null)
    );
    return item?.id;
  },

  initialize: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const guestToken = getGuestToken();

    if (token || guestToken) {
      await get().fetchWishlist();
    }
  },
}));
