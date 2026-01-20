'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  category: string;
  selectedOptions?: {
    size?: string;
    color?: string;
  };
  maxQuantity: number;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onQuantityChange, onRemove }: CartItemProps) => {
  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (item.quantity < item.maxQuantity) {
      onQuantityChange(item.id, item.quantity + 1);
    }
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= item.maxQuantity) {
      onQuantityChange(item.id, value);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-md hover:shadow-warm transition-luxe">
      {/* Product Image */}
      <Link href={`/product-detail?id=${item.id}`} className="flex-shrink-0">
        <div className="w-full sm:w-24 h-32 sm:h-24 overflow-hidden rounded-md">
          <AppImage
            src={item.image}
            alt={item.alt}
            width={96}
            height={96}
            className="w-full h-full object-cover hover:scale-105 transition-luxe"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/product-detail?id=${item.id}`}
              className="font-heading text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-luxe line-clamp-2"
            >
              {item.name}
            </Link>
            <p className="text-caption text-muted-foreground mt-1">
              {item.category}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-muted-foreground hover:text-error transition-luxe"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Icon name="TrashIcon" size={20} />
          </button>
        </div>

        {/* Selected Options */}
        {item.selectedOptions && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.selectedOptions.size && (
              <span className="text-caption px-2 py-1 bg-muted rounded text-muted-foreground">
                Size: {item.selectedOptions.size}
              </span>
            )}
            {item.selectedOptions.color && (
              <span className="text-caption px-2 py-1 bg-muted rounded text-muted-foreground">
                Color: {item.selectedOptions.color}
              </span>
            )}
          </div>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-muted rounded-md p-1">
            <button
              onClick={handleQuantityDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground rounded transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Icon name="MinusIcon" size={16} />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={handleQuantityInput}
              min="1"
              max={item.maxQuantity}
              className="w-12 text-center text-data font-medium bg-transparent border-none focus:outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={handleQuantityIncrease}
              disabled={item.quantity >= item.maxQuantity}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground rounded transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Icon name="PlusIcon" size={16} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-data text-lg font-semibold text-primary">
              ${itemTotal.toFixed(2)}
            </p>
            <p className="text-caption text-muted-foreground">
              ${item.price.toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;