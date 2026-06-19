'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { CartItem as CartItemType } from '@/types/cart';

// Stock issue labels
const stockIssueLabel: Record<string, string> = {
  OUT_OF_STOCK: 'Out of stock',
  INSUFFICIENT_STOCK: '', // filled dynamically
  PRODUCT_INACTIVE: 'Currently unavailable',
  PRODUCT_UNPUBLISHED: 'Currently unavailable',
};

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (cartItemId: number, newQuantity: number) => Promise<void>;
  onRemove: (cartItemId: number) => Promise<void>;
  isUpdating?: boolean;
}

const CartItem = ({ item, onQuantityChange, onRemove, isUpdating = false }: CartItemProps) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  const handleDecrease = async () => {
    const next = localQty - 1;
    if (next < 1) {
      await onRemove(item.cartItemId);
      return;
    }
    setLocalQty(next);
    await onQuantityChange(item.cartItemId, next);
  };

  const handleIncrease = async () => {
    const next = localQty + 1;
    setLocalQty(next);
    await onQuantityChange(item.cartItemId, next);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) return;
    setLocalQty(value);
    await onQuantityChange(item.cartItemId, value);
  };

  // Keep local quantity in sync if the server responds with a different value
  React.useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const getStockWarning = (): string | null => {
    if (!item.stockIssue) return null;
    if (item.stockIssue === 'INSUFFICIENT_STOCK') {
      return `Only ${item.availableStock} left in stock`;
    }
    return stockIssueLabel[item.stockIssue] ?? null;
  };

  const stockWarning = getStockWarning();

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-4 bg-card border rounded-md transition-luxe
        ${item.isAvailable ? 'border-border hover:shadow-warm' : 'border-warning/40 bg-warning/5'}
        ${isUpdating ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      {/* Product Image */}
      <Link href={`/product-detail/${item.productSlug}`} className="flex-shrink-0">
        <div className="w-full sm:w-24 h-32 sm:h-24 overflow-hidden rounded-md bg-muted">
          <AppImage
            src={`/assets/images/no_image.png`}
            alt={item.productName}
            width={96}
            height={96}
            className="w-full h-full object-cover hover:scale-105 transition-luxe"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <Link
              href={`/product-detail/${item.productSlug}`}
              className="font-heading text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-luxe line-clamp-2"
            >
              {item.productName}
            </Link>
            {item.variantName && (
              <p className="text-caption text-muted-foreground mt-0.5">{item.variantName}</p>
            )}
            <p className="text-caption text-muted-foreground text-xs mt-0.5">SKU: {item.sku}</p>
          </div>
          <button
            onClick={() => onRemove(item.cartItemId)}
            className="p-2 text-muted-foreground hover:text-error transition-luxe flex-shrink-0"
            aria-label={`Remove ${item.productName} from cart`}
          >
            <Icon name="TrashIcon" size={20} />
          </button>
        </div>

        {/* Availability warning */}
        {!item.isAvailable && stockWarning && (
          <div className="flex items-center gap-1.5 mb-2 text-warning text-xs font-medium">
            <Icon name="ExclamationTriangleIcon" size={14} />
            <span>{stockWarning}</span>
          </div>
        )}

        {/* Price and Quantity */}
        <div className="flex items-center justify-between gap-4 mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-muted rounded-md p-1">
            <button
              onClick={handleDecrease}
              disabled={isUpdating}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground rounded transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Icon name="MinusIcon" size={16} />
            </button>
            <input
              type="number"
              value={localQty}
              onChange={handleInputChange}
              min="1"
              max={item.availableStock || 99}
              className="w-12 text-center text-data font-medium bg-transparent border-none focus:outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={handleIncrease}
              disabled={isUpdating || localQty >= item.availableStock}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground rounded transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Icon name="PlusIcon" size={16} />
            </button>
          </div>

          {/* Pricing */}
          <div className="text-right">
            <p className="text-data text-lg font-semibold text-primary">
              ₹{item.lineTotal.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 justify-end">
              <p className="text-caption text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p>
              {item.compareAtPrice !== null && item.compareAtPrice > item.unitPrice && (
                <p className="text-caption text-muted-foreground line-through text-xs">
                  ₹{item.compareAtPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
