// hooks/useAuth.ts
import { useState, useEffect } from 'react';

// Define the shape of your user object (customize as needed)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
  email?: string;
  roleName: string;
  roleCode: string;
  theme: string;
  userName: string;
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
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to read user from localStorage', error);
    } finally {
      setIsLoading(false);
    }
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
