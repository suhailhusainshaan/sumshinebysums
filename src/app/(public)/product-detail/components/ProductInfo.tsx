'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductInfoProps {
  name: string;
  price: number;
  originalPrice?: number | null;
  material: string;
  availability: string;
  sku: string;
  brand?: string;
  category?: string;
  featured?: boolean;
}

const ProductInfo = ({
  name,
  price,
  originalPrice,
  material,
  availability,
  sku,
  brand,
  category,
  featured = false,
}: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          {(brand || category || featured) && (
            <div className="flex flex-wrap items-center gap-2">
              {featured && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  Featured
                </span>
              )}
              {brand && <span className="text-caption text-muted-foreground">{brand}</span>}
              {brand && category && <span className="text-caption text-muted-foreground">•</span>}
              {category && <span className="text-caption text-muted-foreground">{category}</span>}
            </div>
          )}
          <h1 className="font-heading text-3xl font-semibold text-foreground lg:text-4xl">
            {name}
          </h1>
        </div>

        <button
          onClick={() => setIsWishlisted((prev) => !prev)}
          className="flex-shrink-0 rounded-full p-2 transition-luxe hover:bg-muted"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon
            name="HeartIcon"
            size={28}
            variant={isWishlisted ? 'solid' : 'outline'}
            className={isWishlisted ? 'text-error' : 'text-foreground'}
          />
        </button>
      </div>

      <div className="flex items-baseline space-x-3">
        <span className="text-data text-4xl font-semibold text-primary">${price.toFixed(2)}</span>
        {originalPrice && (
          <>
            <span className="text-data text-2xl text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="rounded-md bg-error px-3 py-1 text-sm font-medium text-error-foreground">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Material:</span>
          <span className="font-medium text-foreground">{material}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Availability:</span>
          <span className="flex items-center space-x-2">
            <Icon
              name="CheckCircleIcon"
              size={16}
              variant="solid"
              className={availability === 'In Stock' ? 'text-success' : 'text-error'}
            />
            <span
              className={
                availability === 'In Stock' ? 'font-medium text-success' : 'font-medium text-error'
              }
            >
              {availability}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">SKU:</span>
          <span className="text-data text-foreground">{sku}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4">
        <div className="flex flex-col items-center rounded-md bg-muted p-3 text-center">
          <Icon name="TruckIcon" size={24} className="mb-2 text-primary" />
          <span className="text-caption font-medium text-foreground">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center rounded-md bg-muted p-3 text-center">
          <Icon name="ArrowPathIcon" size={24} className="mb-2 text-primary" />
          <span className="text-caption font-medium text-foreground">Easy Returns</span>
        </div>
        <div className="flex flex-col items-center rounded-md bg-muted p-3 text-center">
          <Icon name="ShieldCheckIcon" size={24} className="mb-2 text-primary" />
          <span className="text-caption font-medium text-foreground">Secure Payment</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
