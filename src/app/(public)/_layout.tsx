import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../../styles/index.css';
import AuthGuard from '@/lib/AuthGuard';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'SumShineBySums',
  description: 'Exquisite collection of handcrafted artificial jewelry',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <AuthGuard>{children}</AuthGuard>
      <script type="module" />
      <script type="module" />
    </body>
  );
}
