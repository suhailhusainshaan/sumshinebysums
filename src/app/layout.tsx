import AuthGuard from '@/lib/AuthGuard'; // Change this to wherever you saved AuthGuard
import '../styles/index.css';
import { Toaster } from 'react-hot-toast';
import WishlistInitializer from '@/components/wishlist/WishlistInitializer';
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Page transition progress bar — hooks into Next.js router automatically */}
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
        <AuthGuard>{children}</AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
