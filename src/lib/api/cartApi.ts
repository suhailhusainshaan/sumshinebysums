import api from '@/lib/axios';
import {
  getOrCreateCartGuestToken,
  getCartGuestToken,
  setCartGuestToken,
  clearCartGuestToken,
} from '@/lib/cartCookie';
import { Cart, CartApiResponse } from '@/types/cart';

function cartHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return { 'X-Guest-Token': getOrCreateCartGuestToken() };
}

/** Read X-Guest-Token from a response and persist it if present. */
function captureGuestToken(headers: Record<string, string>): void {
  const guestToken = headers['x-guest-token'];
  if (guestToken) {
    setCartGuestToken(guestToken);
  }
}

export const getCart = async (): Promise<CartApiResponse<Cart>> => {
  const res = await api.get<CartApiResponse<Cart>>('/cart', { headers: cartHeaders() });
  captureGuestToken(res.headers as Record<string, string>);
  return res.data;
};

export const addToCart = async (
  productId: number,
  variantId: number,
  quantity: number,
): Promise<CartApiResponse<Cart>> => {
  const res = await api.post<CartApiResponse<Cart>>(
    '/cart/items',
    { productId, variantId, quantity },
    { headers: cartHeaders() },
  );
  captureGuestToken(res.headers as Record<string, string>);
  return res.data;
};

export const updateCartItem = async (
  cartItemId: number,
  quantity: number,
): Promise<CartApiResponse<Cart>> => {
  const res = await api.put<CartApiResponse<Cart>>(
    `/cart/items/${cartItemId}`,
    { quantity },
    { headers: cartHeaders() },
  );
  return res.data;
};

export const removeCartItem = async (cartItemId: number): Promise<CartApiResponse<Cart>> => {
  const res = await api.delete<CartApiResponse<Cart>>(`/cart/items/${cartItemId}`, {
    headers: cartHeaders(),
  });
  return res.data;
};

export const clearCart = async (): Promise<CartApiResponse<Cart>> => {
  const res = await api.delete<CartApiResponse<Cart>>('/cart', { headers: cartHeaders() });
  return res.data;
};

export const mergeCart = async (guestToken: string): Promise<CartApiResponse<Cart>> => {
  const res = await api.post<CartApiResponse<Cart>>(
    '/cart/merge',
    { guestToken },
    { headers: cartHeaders() },
  );
  clearCartGuestToken();
  return res.data;
};

export { getCartGuestToken, clearCartGuestToken };
