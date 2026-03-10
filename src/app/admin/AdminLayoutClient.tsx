'use client';

import { useSidebar } from '@/context/admin/SidebarContext';
import AppHeader from '@/layout/admin/AppHeader';
import AppSidebar from '@/layout/admin/AppSidebar';
import Backdrop from '@/layout/admin/Backdrop';
import React from 'react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-[1536px] md:p-6">{children}</div>
      </div>
    </div>
  );
}
