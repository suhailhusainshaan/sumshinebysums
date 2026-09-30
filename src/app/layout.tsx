import AuthGuard from '@/lib/AuthGuard';
import '../styles/index.css';
import { Toaster } from 'react-hot-toast';
import WishlistInitializer from '@/components/wishlist/WishlistInitializer';
import CartInitializer from '@/components/cart/CartInitializer';
import NextTopLoader from 'nextjs-toploader';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay';
import { StorefrontThemeProvider } from '@/context/storefront/StorefrontThemeContext';
import { getStorefrontTheme } from '@/service/public-product.service';

async function getInitialLightTheme() {
  try {
    const theme = await getStorefrontTheme();
    return theme.activeLightTheme;
  } catch {
    return 'pearl';
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLightTheme = await getInitialLightTheme();

  return (
    <html lang="en" data-light-theme={initialLightTheme} suppressHydrationWarning>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <StorefrontThemeProvider initialLightTheme={initialLightTheme}>
            <NextTopLoader
              color="#D4A574"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #D4A574, 0 0 5px #D4A574"
            />

            <WishlistInitializer />
            <CartInitializer />

            <GlobalLoadingOverlay />

            <AuthGuard>{children}</AuthGuard>

            <Toaster />
          </StorefrontThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
