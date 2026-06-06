import { getOrCreateGuestToken } from './wishlistCookie';

export function wishlistHeaders(authToken?: string | null): Record<string, string> {
  if (authToken) {
    return { Authorization: `Bearer ${authToken}` };
  }
  return { 'X-Guest-Token': getOrCreateGuestToken() };
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
