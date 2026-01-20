'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductInfoProps {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  material: string;
  availability: string;
  sku: string;
}

const ProductInfo = ({
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  material,
  availability,
  sku,
}: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Product Name & Wishlist */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground">
          {name}
        </h1>
        <button
          onClick={toggleWishlist}
          className="p-2 hover:bg-muted rounded-full transition-luxe flex-shrink-0"
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

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="StarIcon"
              size={20}
              variant={index < Math.floor(rating) ? 'solid' : 'outline'}
              className={index < Math.floor(rating) ? 'text-warning' : 'text-muted-foreground'}
            />
          ))}
        </div>
        <span className="text-data text-foreground font-medium">{rating.toFixed(1)}</span>
        <span className="text-caption text-muted-foreground">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-3">
        <span className="text-data text-4xl font-semibold text-primary">
          ${price.toFixed(2)}
        </span>
        {originalPrice && (
          <>
            <span className="text-data text-2xl text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="bg-error text-error-foreground px-3 py-1 rounded-md text-sm font-medium">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Material:</span>
          <span className="text-foreground font-medium">{material}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Availability:</span>
          <span className="flex items-center space-x-2">
            <Icon
              name="CheckCircleIcon"
              size={16}
              variant="solid"
              className="text-success"
            />
            <span className="text-success font-medium">{availability}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">SKU:</span>
          <span className="text-data text-foreground">{sku}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <div className="flex flex-col items-center text-center p-3 bg-muted rounded-md">
          <Icon name="TruckIcon" size={24} className="text-primary mb-2" />
          <span className="text-caption text-foreground font-medium">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 bg-muted rounded-md">
          <Icon name="ArrowPathIcon" size={24} className="text-primary mb-2" />
          <span className="text-caption text-foreground font-medium">Easy Returns</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 bg-muted rounded-md">
          <Icon name="ShieldCheckIcon" size={24} className="text-primary mb-2" />
          <span className="text-caption text-foreground font-medium">Secure Payment</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;