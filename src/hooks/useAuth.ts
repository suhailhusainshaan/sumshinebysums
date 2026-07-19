// hooks/useAuth.ts
//
// Thin wrapper around useAuthStore so all existing call sites are unchanged.
// The store ensures /auth/me is called exactly once per page load, regardless
// of how many components call useAuth() on the same page.
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function useAuth() {
  const { user, isLoading, initialized, login, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
  };
}
