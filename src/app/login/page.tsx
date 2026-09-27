'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useRouter } from 'next/navigation'; // For redirection
import { authService } from '@/service/auth.service';
import Link from 'next/link';
import { getGuestToken } from '@/lib/wishlistCookie';
import { useWishlistStore } from '@/store/wishlistStore';
import { getCartGuestToken } from '@/lib/api/cartApi';
import { useCartStore } from '@/store/cartStore';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

type LoginMode = 'PASSWORD' | 'OTP';
type OtpMethod = 'EMAIL' | 'WHATSAPP';
type OtpState = 'IDENTIFIER' | 'METHOD_SELECTION' | 'ENTRY';

interface OtpOptionsData {
  requestId: string;
  maskedEmail?: string;
  maskedMobile?: string;
  availableMethods: OtpMethod[];
}

interface OtpSendData {
  requestId: string;
  otpExpiresInSeconds: number;
  resendAllowedInSeconds: number;
  deliveryTarget: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [loginMode, setLoginMode] = useState<LoginMode>('PASSWORD');

  // Password login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP login state
  const [otpState, setOtpState] = useState<OtpState>('IDENTIFIER');
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpOptions, setOtpOptions] = useState<OtpOptionsData | null>(null);
  const [otpSendDetails, setOtpSendDetails] = useState<OtpSendData | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<OtpMethod | null>(null);

  // Timers
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Timers effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0 || expiryCountdown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
        setExpiryCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown, expiryCountdown]);

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleSuccessfulLogin = async (res: any) => {
    const expiryTime = Date.now() + res.data.tokenExpiry;
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('expiry_time', expiryTime.toString());

    useAuthStore.getState().login(res.data.user);

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

    const redirectUrl = res.data?.user?.roleCode === 'SUPER_ADMIN' ? '/admin' : '/';
    router.push(redirectUrl);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isMobile = /^\d{10}$/.test(identifier);

    if (!isEmail && !isMobile) {
      setError('Please enter a valid email or 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.login({ username: identifier, password });
      if (res.status === 200) {
        await handleSuccessfulLogin(res);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpOptions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await authService.otpOptions(otpIdentifier);
      if (res.status === 200) {
        setOtpOptions(res.data);
        setOtpState('METHOD_SELECTION');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'No OTP login option found for this account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSend = async (method: OtpMethod) => {
    if (!otpOptions) return;
    setIsLoading(true);
    setError('');
    setSelectedMethod(method);

    try {
      const res = await authService.sendOtp(otpOptions.requestId, method);
      if (res.status === 200) {
        setOtpSendDetails(res.data);
        setOtpState('ENTRY');
        setExpiryCountdown(res.data.otpExpiresInSeconds);
        setResendCooldown(res.data.resendAllowedInSeconds);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpResend = async () => {
    if (resendCooldown > 0 || !selectedMethod) return;
    handleOtpSend(selectedMethod);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSendDetails) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await authService.verifyOtp(otpSendDetails.requestId, otpValue);
      if (res.status === 200) {
        await handleSuccessfulLogin(res);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
      setOtpValue(''); // clear OTP field
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError('');
      const googleToken = credentialResponse.credential;
      const res = await authService.googleLogin({ idToken: googleToken });
      if (res.status === 200) {
        await handleSuccessfulLogin(res);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div
        className={`bg-card w-full max-w-md p-10 rounded-xl shadow-warm relative transition-transform transition-opacity duration-200 ease-in-out ${
          isLoading ? 'opacity-70 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
        aria-busy={isLoading}
      >
        <div className="text-center mb-6">
          <Link href="/" className="group">
            <h1 className="text-3xl font-heading font-semibold text-primary transition-luxe group-hover:opacity-80">
              Sumshine By Sums
            </h1>
          </Link>
          <h2 className="mt-2 text-xl font-medium text-foreground">Login to your account</h2>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex bg-muted p-1 rounded-lg mb-6 border border-border relative">
          <button
            type="button"
            className={`relative flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors z-10 ${
              loginMode === 'PASSWORD'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setLoginMode('PASSWORD')}
          >
            {loginMode === 'PASSWORD' && (
              <motion.div
                layoutId="loginTab"
                className="absolute inset-0 bg-background rounded-md shadow-sm border border-border"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                style={{ zIndex: -1 }}
              />
            )}
            Password
          </button>
          <button
            type="button"
            className={`relative flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors z-10 ${
              loginMode === 'OTP'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setLoginMode('OTP')}
          >
            {loginMode === 'OTP' && (
              <motion.div
                layoutId="loginTab"
                className="absolute inset-0 bg-background rounded-md shadow-sm border border-border"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                style={{ zIndex: -1 }}
              />
            )}
            OTP
          </button>
        </div>

        {loginMode === 'PASSWORD' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email or Mobile
              </label>
              <input
                type="text"
                placeholder="Enter email or mobile"
                className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
        ) : (
          <div className="space-y-5">
            {otpState === 'IDENTIFIER' && (
              <form onSubmit={handleOtpOptions} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email or Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email or mobile"
                    className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                    value={otpIdentifier}
                    onChange={(e) => setOtpIdentifier(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:shadow-warm-md transition-luxe"
                >
                  Continue
                </button>
              </form>
            )}

            {otpState === 'METHOD_SELECTION' && otpOptions && (
              <div className="space-y-4">
                <p className="text-sm text-foreground text-center mb-4">
                  Choose where to receive your OTP:
                </p>
                {otpOptions.availableMethods.includes('EMAIL') && (
                  <button
                    onClick={() => handleOtpSend('EMAIL')}
                    className="w-full border border-border bg-card text-foreground py-3 rounded-md font-medium hover:bg-muted transition-luxe"
                  >
                    Send OTP to {otpOptions.maskedEmail}
                  </button>
                )}
                {otpOptions.availableMethods.includes('WHATSAPP') && (
                  <button
                    onClick={() => handleOtpSend('WHATSAPP')}
                    className="w-full border border-border bg-card text-foreground py-3 rounded-md font-medium hover:bg-muted transition-luxe flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    <span>Send OTP on WhatsApp {otpOptions.maskedMobile}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOtpState('IDENTIFIER');
                    setOtpOptions(null);
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground mt-2"
                >
                  Back
                </button>
              </div>
            )}

            {otpState === 'ENTRY' && otpSendDetails && (
              <form onSubmit={handleOtpVerify} className="space-y-5">
                <div className="text-center mb-4">
                  <p className="text-sm text-foreground">
                    OTP sent to{' '}
                    <span className="font-semibold">{otpSendDetails.deliveryTarget}</span>
                  </p>
                  {expiryCountdown > 0 ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires in {formatTime(expiryCountdown)}
                    </p>
                  ) : (
                    <p className="text-xs text-red-500 mt-1">OTP expired. Please request again.</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center tracking-widest text-lg transition-luxe"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    disabled={expiryCountdown === 0}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:shadow-warm-md transition-luxe"
                  disabled={otpValue.length !== 6 || expiryCountdown === 0}
                >
                  Verify OTP
                </button>

                <div className="flex flex-col items-center mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={handleOtpResend}
                    disabled={resendCooldown > 0 || expiryCountdown === 0}
                    className={`text-sm ${
                      resendCooldown > 0 || expiryCountdown === 0
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'text-primary hover:underline'
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpState('IDENTIFIER');
                      setOtpOptions(null);
                      setOtpSendDetails(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Change Identifier
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

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
