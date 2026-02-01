'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
  onQuickAdd: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  alt,
  rating,
  reviewCount,
  category,
  isNew = false,
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
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-warm hover:shadow-warm-md transition-luxe">
      <Link href={`/product-detail?id=${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <AppImage
            src={image}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-luxe"
            width={400}
            height={400}
            onClick={() => setImageLoaded(true)}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-error text-error-foreground text-xs font-medium px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-card rounded-full shadow-warm opacity-0 group-hover:opacity-100 transition-luxe hover:scale-110"
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

        {/* Product Info */}
        <div className="p-4">
          <p className="text-caption text-muted-foreground mb-1">{category}</p>
          <p className="font-medium text-foreground mb-2 line-clamp-3 min-h-[3rem]">
            {name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  name="StarIcon"
                  size={14}
                  variant={index < Math.floor(rating) ? 'solid' : 'outline'}
                  className={index < Math.floor(rating) ? 'text-warning' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <span className="text-caption text-muted-foreground">
              ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
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

      {/* Quick Add Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleQuickAdd}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center gap-2"
        >
          <Icon name="ShoppingBagIcon" size={18} />
          Quick Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;