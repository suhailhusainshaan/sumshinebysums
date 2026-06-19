import { create } from 'zustand';
import * as cartApi from '@/lib/api/cartApi';
import { Cart, CartState } from '@/types/cart';

interface CartStore extends CartState {
  fetchCart: () => Promise<void>;
  addItem: (productId: number, variantId: number, quantity: number) => Promise<string>;
  updateItem: (cartItemId: number, quantity: number) => Promise<string>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: (guestToken: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await cartApi.getCart();
      if (res.status) {
        set({ cart: res.data, loading: false });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch cart', loading: false });
    }
  },

  addItem: async (productId, variantId, quantity) => {
    const res = await cartApi.addToCart(productId, variantId, quantity);
    if (res.status) {
      set({ cart: res.data });
      return res.message; // caller can check for "Quantity adjusted to available stock"
    }
    throw new Error(res.message);
  },

  updateItem: async (cartItemId, quantity) => {
    const res = await cartApi.updateCartItem(cartItemId, quantity);
    if (res.status) {
      set({ cart: res.data });
      return res.message;
    }
    throw new Error(res.message);
  },

  removeItem: async (cartItemId) => {
    const res = await cartApi.removeCartItem(cartItemId);
    if (res.status) {
      set({ cart: res.data });
    } else {
      throw new Error(res.message);
    }
  },

  clearCart: async () => {
    const res = await cartApi.clearCart();
    if (res.status) {
      set({ cart: res.data });
    } else {
      throw new Error(res.message);
    }
  },

  mergeGuestCart: async (guestToken) => {
    try {
      const res = await cartApi.mergeCart(guestToken);
      if (res.status) {
        set({ cart: res.data });
      }
    } catch (e: any) {
      console.error('Failed to merge guest cart:', e);
    }
  },

  initialize: async () => {
    await get().fetchCart();
  },
}));
