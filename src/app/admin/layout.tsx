import { Outfit } from 'next/font/google';

import '../../styles/globals.css';
import 'flatpickr/dist/flatpickr.css';
import { SidebarProvider } from '@/context/admin/SidebarContext';
import { ThemeProvider } from '@/context/admin/ThemeContext';
import AdminLayoutClient from './AdminLayoutClient';
import React from 'react';

const outfit = Outfit({ subsets: ['latin'] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // We wrap everything in the Providers and the HTML shell here
    // since this is the "Root" for the Admin section
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AdminLayoutClient>{children}</AdminLayoutClient>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
