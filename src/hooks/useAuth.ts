// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '@/service/auth.service';

// Define the shape of your user object (customize as needed)
interface User {
  id: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  gender?: string;
  avatar?: string | null;
  email?: string;
  roleName?: string;
  role?: string;
  roleCode?: string;
  theme?: string | null;
  userName?: string;
}

interface UseAuthReturn {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client after the first render
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await authService.me();
        if (isMounted && res?.status === 200 && res?.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (error) {
        console.error('Failed to fetch current user', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return { user, isLoggedIn: !!user, isLoading, login, logout };
}
