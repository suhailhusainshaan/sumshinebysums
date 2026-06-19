import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export const CART_COOKIE_NAME = 'cart_guest_token';

export function getOrCreateCartGuestToken(): string {
  let token = Cookies.get(CART_COOKIE_NAME);
  if (!token) {
    token = uuidv4();
    Cookies.set(CART_COOKIE_NAME, token, { expires: 30, path: '/', sameSite: 'Lax' });
  }
  return token;
}

export function getCartGuestToken(): string | undefined {
  return Cookies.get(CART_COOKIE_NAME);
}

export function setCartGuestToken(token: string): void {
  Cookies.set(CART_COOKIE_NAME, token, { expires: 30, path: '/', sameSite: 'Lax' });
}

export function clearCartGuestToken(): void {
  Cookies.remove(CART_COOKIE_NAME, { path: '/' });
}
