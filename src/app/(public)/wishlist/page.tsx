'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import Header from '@/components/common/Header';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import toast from 'react-hot-toast';

import { resolveImageSrc } from '@/lib/image';

function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse h-8 w-48 bg-muted rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg bg-card shadow-warm"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WishlistPage() {
  const { items, loading, fetchWishlist, removeItem } = useWishlistStore();

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

  if (loading) {
    return <WishlistSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
            My Wishlist
          </h1>
          <p className="text-muted-foreground mb-8">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <Icon
                  name="HeartIcon"
                  size={40}
                  className="text-muted-foreground"
                />
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
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => {
                const image =
                  item.productImages.find((img) => img.isFeatureImage)
                    ?.imageUrl ||
                  item.productImages[0]?.imageUrl ||
                  '/assets/images/no_image.png';

                return (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg bg-card shadow-warm transition-luxe hover:shadow-warm-md"
                  >
                    <Link
                      href={`/product-detail?id=${item.productId}`}
                      className="block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <AppImage
                          src={
                            image.startsWith('http')
                              ? image
                              : resolveImageSrc(image)
                          }
                          alt={
                            item.productImages.find((img) => img.isFeatureImage)
                              ?.altText || item.product.name
                          }
                          className="h-full w-full object-cover transition-luxe group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4">
                        <p className="text-caption text-muted-foreground mb-1">
                          {item.variant?.name || 'Default'}
                        </p>
                        <h3 className="font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
                          {item.product.name}
                        </h3>
                        <p className="text-data text-lg font-semibold text-primary">
                          ${(item.variant?.price || 0).toFixed(2)}
                        </p>
                        {item.variant?.compareAtPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${item.variant.compareAtPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2 font-medium text-foreground transition-luxe hover:bg-error hover:text-error-foreground hover:border-error"
                      >
                        <Icon name="TrashIcon" size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
