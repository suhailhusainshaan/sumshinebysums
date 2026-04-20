'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  alt: string;
  category?: string;
  brand?: string;
  isFeatured?: boolean;
  onQuickAdd: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard = ({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  alt,
  category,
  brand,
  isFeatured = false,
  onQuickAdd,
  onWishlistToggle,
  isInWishlist,
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickAdd(id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onWishlistToggle(id);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card shadow-warm transition-luxe hover:shadow-warm-md">
      <Link href={`/product-detail?id=${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
          <AppImage
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-luxe group-hover:scale-105"
            // width={400}
            // height={400}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {isFeatured && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-error px-3 py-1 text-xs font-medium text-error-foreground">
                -{discount}%
              </span>
            )}
          </div>

          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 rounded-full bg-card p-2 shadow-warm opacity-0 transition-luxe hover:scale-110 group-hover:opacity-100"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Icon
              name="HeartIcon"
              size={20}
              variant={isInWishlist ? 'solid' : 'outline'}
              className={isInWishlist ? 'text-error' : 'text-foreground'}
            />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-1 text-caption text-muted-foreground">
            {[brand, category].filter(Boolean).join(' • ') || slug}
          </p>
          <p className="mb-2 line-clamp-3 min-h-[3rem] font-medium text-foreground">{name}</p>

          <div className="mb-4 flex items-center gap-2">
            <span className="text-data text-lg font-semibold text-primary">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-data text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleQuickAdd}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-luxe hover:scale-102 hover:shadow-warm-md"
        >
          <Icon name="ShoppingBagIcon" size={18} />
          Quick Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
