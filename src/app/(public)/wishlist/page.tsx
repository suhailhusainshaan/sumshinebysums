'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/common/Header';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import { resolveImageSrc } from '@/lib/image';

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Breadcrumb bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border animate-pulse">
          <div className="h-4 w-40 bg-muted rounded" />
        </div>
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
          {/* sidebar skeleton */}
          <div className="lg:w-72 shrink-0 border-r border-border px-6 pt-8 space-y-3 animate-pulse">
            <div className="h-14 bg-muted rounded-lg" />
            <div className="h-28 bg-muted rounded-lg" />
            <div className="h-14 bg-muted rounded-lg" />
          </div>
          {/* grid skeleton */}
          <div className="flex-1 px-8 lg:px-12 pt-8 animate-pulse">
            <div className="h-8 w-56 bg-muted rounded mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg bg-card shadow-warm overflow-hidden">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Product Card ──────────────────────────────────────────────────────── */
interface CardProps {
  item: ReturnType<typeof useWishlistStore.getState>['items'][number];
  onRemove: (id: number) => void;
  onAddToCart: (productId: number, variantId?: number) => Promise<void>;
}

function WishlistCard({ item, onRemove, onAddToCart }: CardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const image =
    item.productImages.find((img) => img.isFeatureImage)?.imageUrl ||
    item.productImages[0]?.imageUrl ||
    '/assets/images/no_image.png';

  const price = item.variant?.price ?? 0;
  const compareAt = item.variant?.compareAtPrice ?? 0;
  const discountPct =
    compareAt > 0 ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(item.productId, item.variantId ?? undefined);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative bg-card rounded-lg shadow-warm overflow-hidden transition-luxe hover:shadow-warm-md flex flex-col">
      {/* Remove (×) button */}
      <button
        onClick={() => onRemove(item.id)}
        aria-label="Remove from wishlist"
        className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-error hover:border-error transition-luxe"
      >
        <Icon name="XMarkIcon" size={14} />
      </button>

      {/* Image */}
      <Link
        href={`/product-detail/${item.productId}${item.variantId ? `?variant=${item.variantId}` : ''}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <AppImage
            src={image.startsWith('http') ? image : resolveImageSrc(image)}
            alt={
              item.productImages.find((img) => img.isFeatureImage)?.altText ||
              item.product.name
            }
            className="h-full w-full object-cover transition-luxe group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          href={`/product-detail/${item.productId}${item.variantId ? `?variant=${item.variantId}` : ''}`}
          className="block"
        >
          <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem] leading-snug">
            {item.product.name}
          </h3>

          {/* Pricing row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {compareAt > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{compareAt.toFixed(2)}
              </span>
            )}
            <span className="text-base font-semibold text-foreground">
              ₹{price.toFixed(2)}
            </span>
            {discountPct > 0 && (
              <span className="text-sm font-medium text-primary">
                {discountPct}% Off
              </span>
            )}
          </div>
        </Link>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !item.variant}
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide text-primary border-t border-border pt-3 hover:text-primary/80 transition-luxe uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
          ) : (
            <Icon name="ShoppingBagIcon" size={16} />
          )}
          {isAdding ? 'Adding…' : 'Move to Bag'}
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function WishlistPage() {
  const { items, loading, fetchWishlist, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (productId: number, variantId?: number) => {
    if (!variantId) {
      toast.error('No variant available for this item');
      return;
    }
    try {
      const message = await addToCart(productId, variantId, 1);
      if (message === 'Quantity adjusted to available stock') {
        toast('Quantity adjusted to maximum available stock', { icon: 'ℹ️' });
      } else {
        toast.success('Added to cart!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  if (loading) return <WishlistSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">

        {/* Breadcrumb — full width with consistent padding */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
          <nav className="text-sm text-muted-foreground flex items-center gap-1">
            <Link href="/" className="hover:text-primary transition-luxe">Home</Link>
            <Icon name="ChevronRightIcon" size={14} />
            <span className="text-foreground">My Wishlist</span>
          </nav>
        </div>

        {/* Full-width two-column layout: sidebar flush left, content fills right */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">

          {/* ── Sidebar ── pinned to the left, fixed width, with its own padding */}
          <aside className="lg:w-72 shrink-0 border-r border-border bg-background px-4 pt-8 pb-12 lg:px-6">
            {/* My Profile */}
            <div className="bg-card rounded-lg shadow-warm mb-3 overflow-hidden">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-5 py-4 hover:bg-muted transition-luxe"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                  <Icon name="UserIcon" size={18} />
                </span>
                <span className="font-medium text-foreground">My Profile</span>
              </Link>
            </div>

            {/* Nav group */}
            <div className="bg-card rounded-lg shadow-warm mb-3 overflow-hidden divide-y divide-border">
              {/* My Orders */}
              <Link
                href="/"
                className="flex items-center gap-3 px-5 py-4 hover:bg-muted transition-luxe group"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground group-hover:text-primary transition-luxe">
                  <Icon name="ClipboardDocumentListIcon" size={18} />
                </span>
                <span className="font-medium text-foreground">My Orders</span>
              </Link>

              {/* Favourites — active */}
              <div className="relative flex items-center gap-3 px-5 py-4 bg-muted/40">
                <span className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r-full" />
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  <Icon name="HeartIcon" size={18} variant="solid" />
                </span>
                <span className="font-semibold text-primary">Favourites</span>
              </div>
            </div>

            {/* Log Out */}
            <div className="bg-card rounded-lg shadow-warm overflow-hidden">
              <LogOutButton />
            </div>
          </aside>

          {/* ── Content ── takes remaining width, its own padding */}
          <div className="flex-1 min-w-0 px-8 lg:px-12 pt-8 pb-12">
            {/* Heading */}
            <div className="flex items-baseline gap-3 mb-8">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                Favourites
              </h1>
              <span className="text-2xl lg:text-3xl font-bold text-primary">
                ({items.length})
              </span>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-6 bg-card rounded-lg shadow-warm">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="HeartIcon" size={36} className="text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-medium text-foreground mb-2">
                    Your wishlist is empty
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Save items you love and find them here anytime
                  </p>
                </div>
                <Link
                  href="/product-listing"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-luxe"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <WishlistCard key={item.id} item={item} onRemove={handleRemove} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

/* ─── LogOut extracted to avoid hook-in-render issues ───────────────────── */
function LogOutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-luxe group"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground group-hover:text-error transition-luxe">
        <Icon name="ArrowRightOnRectangleIcon" size={18} />
      </span>
      <span className="font-medium text-foreground group-hover:text-error transition-luxe">
        Log Out
      </span>
    </button>
  );
}
