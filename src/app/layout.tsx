import AuthGuard from '@/lib/AuthGuard';
import '../styles/index.css';
import { Toaster } from 'react-hot-toast';
import WishlistInitializer from '@/components/wishlist/WishlistInitializer';
import NextTopLoader from 'nextjs-toploader';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay';

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

          <GlobalLoadingOverlay />

          <AuthGuard>{children}</AuthGuard>

          <Toaster />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}