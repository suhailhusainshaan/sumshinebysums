'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useRouter } from 'next/navigation'; // For redirection
import { authService } from '@/service/auth.service';
import Link from 'next/link';
import { getGuestToken } from '@/lib/wishlistCookie';
import { useWishlistStore } from '@/store/wishlistStore';
import { getCartGuestToken } from '@/lib/api/cartApi';
import { useCartStore } from '@/store/cartStore';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Backend expects "username", not "email"
      const res = await authService.login({ username: email, password });

      if (res.status === 200) {
        const expiryTime = Date.now() + res.data.tokenExpiry;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('expiry_time', expiryTime);

        const guestToken = getGuestToken();
        if (guestToken) {
          try {
            await useWishlistStore.getState().mergeGuestWishlist(guestToken);
          } catch (e) {
            console.error('Failed to merge wishlist:', e);
          }
        } else {
          await useWishlistStore.getState().fetchWishlist();
        }

        // Merge guest cart if one exists
        const cartGuestToken = getCartGuestToken();
        if (cartGuestToken) {
          try {
            await useCartStore.getState().mergeGuestCart(cartGuestToken);
          } catch (e) {
            console.error('Failed to merge cart:', e);
          }
        } else {
          await useCartStore.getState().fetchCart();
        }

        const redirectUrl = res.data?.user?.roleCode === 'SUPER_ADMIN' ? '/admin' : '/';
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
  try {
    setIsLoading(true);
    setError('');

    const googleToken = credentialResponse.credential;


    // This endpoint will be implemented in Java backend
    const res = await authService.googleLogin({
      token: googleToken,
    });

    if (res.status === 200) {
      const expiryTime = Date.now() + res.data.tokenExpiry;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('expiry_time', expiryTime.toString());

      const guestToken = getGuestToken();

      if (guestToken) {
        try {
          await useWishlistStore.getState().mergeGuestWishlist(guestToken);
        } catch (e) {
          console.error('Failed to merge wishlist:', e);
        }
      } else {
        await useWishlistStore.getState().fetchWishlist();
      }

      const cartGuestToken = getCartGuestToken();

      if (cartGuestToken) {
        try {
          await useCartStore.getState().mergeGuestCart(cartGuestToken);
        } catch (e) {
          console.error('Failed to merge cart:', e);
        }
      } else {
        await useCartStore.getState().fetchCart();
      }

      const redirectUrl =
        res.data?.user?.roleCode === 'SUPER_ADMIN'
          ? '/admin'
          : '/';

      router.push(redirectUrl);
    }
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      'Google login failed. Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-card w-full max-w-md p-10 rounded-xl shadow-warm relative">
        <div className="text-center mb-6">
          <Link href="/" className="group">
            <h1 className="text-3xl font-heading font-semibold text-primary transition-luxe group-hover:opacity-80">
              Sumshine By Sums
            </h1>
          </Link>
        </div>

        <h2 className="text-xl font-semibold text-center text-foreground mb-6">
          Login to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>

            <input
              type="email"
              placeholder="john@example.com"
              className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end text-sm">
            <a className="text-primary hover:underline cursor-pointer">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:shadow-warm-md transition-luxe flex items-center justify-center space-x-2"
          >
            <span>Login</span>
            <Icon name="ArrowRightIcon" size={18} />
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              setError('Google Login Failed');
            }}
          />
        </div>


        <p className="text-center text-sm text-muted-foreground">
          New to Sumshine By Sums?{' '}
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={handleRegisterClick}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}
