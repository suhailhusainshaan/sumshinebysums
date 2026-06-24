'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import AccountSidebar from '@/components/account/AccountSidebar';
import {
  deleteAddress,
  getAddresses,
  getApiMessage,
  setDefaultAddress,
} from '@/lib/api/checkoutApi';
import { Address } from '@/types/checkout';

function isAuthError(message: string): boolean {
  return /unauthorized|jwt|token/i.test(message);
}

export default function AccountAddressesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    const res = await getAddresses();
    if (!res.status) throw new Error(res.message);
    setAddresses(res.data);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to manage addresses');
      router.push('/login?redirect=/account/addresses');
      return;
    }

    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        await loadAddresses();
      } catch (error) {
        const message = getApiMessage(error, 'Failed to load addresses');
        if (isAuthError(message)) {
          toast.error('Please sign in to manage addresses');
          router.push('/login?redirect=/account/addresses');
          return;
        }
        toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [loadAddresses, router]);

  const handleSetDefault = async (id: number) => {
    setSettingDefaultId(id);
    try {
      const res = await setDefaultAddress(id);
      if (!res.status) throw new Error(res.message);
      toast.success('Default address updated');
      await loadAddresses();
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to update default address'));
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (address: Address) => {
    const confirmed = window.confirm(`Delete ${address.label || address.fullName} address?`);
    if (!confirmed) return;

    setDeletingId(address.id);
    try {
      const res = await deleteAddress(address.id);
      if (!res.status) throw new Error(res.message);
      toast.success('Address deleted');
      await loadAddresses();
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to delete address'));
    } finally {
      setDeletingId(null);
    }
  };

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
            <span className="text-foreground">Addresses</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
          <AccountSidebar active="addresses" />

          <div className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 pt-8 pb-12">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                  Addresses
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage delivery addresses used during checkout.
                </p>
              </div>
              <Link
                href="/account/addresses/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe"
              >
                <Icon name="PlusIcon" size={18} />
                Add Address
              </Link>
            </div>

            {loading ? (
              <AddressSkeleton />
            ) : addresses.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-md p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Icon name="MapPinIcon" size={30} className="text-muted-foreground" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  No addresses yet
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a delivery address now and it will be ready at checkout.
                </p>
                <Link
                  href="/account/addresses/new"
                  className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe"
                >
                  <Icon name="PlusIcon" size={18} />
                  Add Address
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    deleting={deletingId === address.id}
                    settingDefault={settingDefaultId === address.id}
                    onDelete={() => handleDelete(address)}
                    onSetDefault={() => handleSetDefault(address.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function AddressSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-pulse">
      <div className="h-44 rounded-md bg-muted" />
      <div className="h-44 rounded-md bg-muted" />
      <div className="h-44 rounded-md bg-muted" />
    </div>
  );
}

interface AddressCardProps {
  address: Address;
  deleting: boolean;
  settingDefault: boolean;
  onDelete: () => void;
  onSetDefault: () => void;
}

function AddressCard({
  address,
  deleting,
  settingDefault,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <article className="bg-card border border-border rounded-md p-5 shadow-warm">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {address.label || 'Address'}
            </h2>
            {address.isDefault && (
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                Default
              </span>
            )}
          </div>
          <p className="mt-2 font-medium text-foreground">{address.fullName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ''}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-sm text-muted-foreground">{address.country}</p>
          <p className="mt-2 text-sm text-muted-foreground">{address.phone}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/account/addresses/${address.id}/edit`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted transition-luxe"
          >
            <Icon name="PencilSquareIcon" size={16} />
            Edit
          </Link>
          {!address.isDefault && (
            <button
              type="button"
              disabled={settingDefault}
              onClick={onSetDefault}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted transition-luxe disabled:opacity-60"
            >
              <Icon name="CheckCircleIcon" size={16} />
              {settingDefault ? 'Saving...' : 'Set default'}
            </button>
          )}
          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-error/30 px-3 text-sm font-medium text-error hover:bg-error/10 transition-luxe disabled:opacity-60"
          >
            <Icon name="TrashIcon" size={16} />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
