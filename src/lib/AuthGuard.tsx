'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  function validExpiry(expiryTime: string | null) {
    if (expiryTime && Date.now() >= parseInt(expiryTime)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expiry_time');
      window.location.href = '/';
      return;
    }
  }
  useEffect(() => {
    const expiryTime = localStorage.getItem('expiry_time');
    validExpiry(expiryTime);

    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = rawUser ? JSON.parse(rawUser) : null;

    const isAdminRoute = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/login';
    const isRegisterPage = pathname === '/register';

    // Check if the current path is part of the "Public Website"
    // (Everything that isn't admin, login, or register)
    const isPublicWebsite = !isAdminRoute && !isLoginPage && !isRegisterPage;

    // 1. If logged in and trying to access login/register, redirect away
    if ((isLoginPage || isRegisterPage) && token) {
      router.replace(user?.roleCode === 'SUPER_ADMIN' ? '/admin' : '/');
      return;
    }

    // 2. PROTECT ADMIN: Redirect non-admins away from /admin
    if (isAdminRoute) {
      if (!token || user?.roleCode !== 'SUPER_ADMIN') {
        router.replace('/login');
        return;
      }
    }

    // 3. ADMIN ISOLATION: If admin tries to access the public website/base URL
    if (isPublicWebsite && token && user?.roleCode === 'SUPER_ADMIN') {
      router.replace('/admin');
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized) return null; // Or a loading spinner

  return <>{children}</>;
}
