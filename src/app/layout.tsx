import AuthGuard from '@/lib/AuthGuard'; // Change this to wherever you saved AuthGuard
import '../styles/index.css';
import { Toaster } from 'react-hot-toast';
import WishlistInitializer from '@/components/wishlist/WishlistInitializer';
import { Fraunces, Inter } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body bg-ivory text-ink">
        <WishlistInitializer />
        <AuthGuard>{children}</AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
