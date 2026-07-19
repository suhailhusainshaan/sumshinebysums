import { create } from 'zustand';
import { authService } from '@/service/auth.service';

interface User {
  id: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  gender?: string;
  avatar?: string | null;
  email?: string;
  mobile?: string;
  roleName?: string;
  role?: string;
  roleCode?: string;
  theme?: string | null;
  userName?: string;
  username?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  /** Whether the initial /auth/me fetch has been attempted (success or fail) */
  initialized: boolean;
  login: (userData: User) => void;
  logout: () => void;
  /**
   * Call once at app boot. Safe to call from many components simultaneously —
   * the guard ensures only a single /auth/me request is ever in flight.
   */
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  initialized: false,

  login: (userData) => {
    set({ user: userData });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  },

  logout: () => {
    set({ user: null, initialized: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  },

  initialize: async () => {
    // If already initialized (or currently initializing), bail out.
    // `initialized` flips to true before the async work begins, so concurrent
    // callers from multiple components all see the flag and return immediately.
    if (get().initialized) return;
    set({ initialized: true });

    // Seed from localStorage immediately so the UI doesn't flash empty
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          set({ user: JSON.parse(storedUser) });
        } catch {
          // ignore malformed JSON
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
    } else {
      set({ isLoading: false });
      return;
    }

    try {
      const res = await authService.me();
      if (res?.status === 200 && res?.data) {
        set({ user: res.data });
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      }
    } catch (error) {
      console.error('[authStore] Failed to fetch current user', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
