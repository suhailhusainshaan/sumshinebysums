import React from 'react';
import '@/styles/index.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <body>{children}</body>;
}
