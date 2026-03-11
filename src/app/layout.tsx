import AuthGuard from '@/lib/AuthGuard'; // Change this to wherever you saved AuthGuard
import '../styles/index.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
