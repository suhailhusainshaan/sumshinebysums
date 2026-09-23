import AuthGuard from '@/lib/AuthGuard';
import '../styles/index.css';
import { Toaster } from 'react-hot-toast';
import WishlistInitializer from '@/components/wishlist/WishlistInitializer';
import CartInitializer from '@/components/cart/CartInitializer';
import NextTopLoader from 'nextjs-toploader';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Sumshine By Sums',
    default: 'Sumshine By Sums | Handcrafted Artificial Jewelry',
  },
  description: 'Discover exquisite handcrafted artificial jewelry at Sumshine By Sums. Shop necklaces, earrings, bracelets, rings, and sets with premium quality designs at accessible prices.',
  openGraph: {
    title: 'Sumshine By Sums',
    description: 'Discover exquisite handcrafted artificial jewelry at Sumshine By Sums.',
    url: 'https://www.sumshinebysums.com',
    siteName: 'Sumshine By Sums',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643477874-5c866f5c0c0b?q=80&w=1200&auto=format&fit=crop', // Temporary placeholder hero image
        width: 1200,
        height: 630,
        alt: 'Sumshine By Sums - Premium Jewelry',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sumshine By Sums',
    description: 'Discover exquisite handcrafted artificial jewelry at Sumshine By Sums.',
    images: ['https://images.unsplash.com/photo-1599643477874-5c866f5c0c0b?q=80&w=1200&auto=format&fit=crop'], // Temporary placeholder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
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
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}