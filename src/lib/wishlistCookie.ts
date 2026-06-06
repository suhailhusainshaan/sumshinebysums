import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export const COOKIE_NAME = 'wishlist_token';

export function getOrCreateGuestToken(): string {
  let token = Cookies.get(COOKIE_NAME);
  if (!token) {
    token = uuidv4();
    Cookies.set(COOKIE_NAME, token, { expires: 30, path: '/', sameSite: 'Lax' });
  }
  return token;
}

export function getGuestToken(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}

export function clearGuestToken(): void {
  Cookies.remove(COOKIE_NAME, { path: '/' });
}
