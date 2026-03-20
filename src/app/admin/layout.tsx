'use client';

import { Outfit } from 'next/font/google';
import '../../styles/globals.css';
import 'flatpickr/dist/flatpickr.css';
import { SidebarProvider } from '@/context/admin/SidebarContext';
import { ThemeProvider } from '@/context/admin/ThemeContext';
import AdminLayoutClient from './AdminLayoutClient';
import React from 'react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({ subsets: ['latin'] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add the admin classes when entering this section
    document.body.classList.add('dark:bg-gray-900', 'admin-theme-active');

    // Cleanup: Remove the classes when leaving the admin section
    return () => {
      document.body.classList.remove('dark:bg-gray-900', 'admin-theme-active');
    };
  }, []);
  return (
    // We wrap everything in the Providers and the HTML shell here
    // since this is the "Root" for the Admin section
    <ThemeProvider>
      <SidebarProvider>
        <AdminLayoutClient>
          {children}

          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                zIndex: 9999,
              },
              success: {
                duration: 3000,
                icon: '✅',
              },
            }}
            containerStyle={{
              zIndex: 9999, // Also set on container
            }}
          />
        </AdminLayoutClient>
      </SidebarProvider>
    </ThemeProvider>
  );
}
