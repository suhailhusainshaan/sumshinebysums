'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import AccountSidebar from '@/components/account/AccountSidebar';
import AddressEditor from '@/components/account/AddressEditor';

export default function EditAddressPage() {
  const params = useParams<{ id: string }>();
  const addressId = Number(params.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
          <nav className="text-sm text-muted-foreground flex items-center gap-1">
            <Link href="/" className="hover:text-primary transition-luxe">
              Home
            </Link>
            <Icon name="ChevronRightIcon" size={14} />
            <Link href="/account/addresses" className="hover:text-primary transition-luxe">
              Addresses
            </Link>
            <Icon name="ChevronRightIcon" size={14} />
            <span className="text-foreground">Edit Address</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
          <AccountSidebar active="addresses" />
          <div className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 pt-8 pb-12">
            <div className="mb-8">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                Edit Address
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update this delivery address for future checkouts.
              </p>
            </div>
            <div className="max-w-3xl">
              <AddressEditor addressId={Number.isFinite(addressId) ? addressId : undefined} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
