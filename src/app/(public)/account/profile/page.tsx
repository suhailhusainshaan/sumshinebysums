'use client';

import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import AccountSidebar from '@/components/account/AccountSidebar';

export default function AccountProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
          <nav className="text-sm text-muted-foreground flex items-center gap-1">
            <span>Home</span>
            <Icon name="ChevronRightIcon" size={14} />
            <span className="text-foreground">My Profile</span>
          </nav>
        </div>
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
          <AccountSidebar active="profile" />
          <div className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 pt-8 pb-12">
            <div className="bg-card border border-border rounded-md p-8">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                My Profile
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Profile management will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
