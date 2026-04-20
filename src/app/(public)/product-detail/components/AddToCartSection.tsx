'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SizeOption {
  id: string;
  label: string;
  available: boolean;
}

interface AddToCartSectionProps {
  sizes?: SizeOption[];
  showSizeGuide?: boolean;
  onAddToCart?: (quantity: number, size?: string) => void;
}

const AddToCartSection = ({
  sizes = [],
  showSizeGuide = false,
  onAddToCart,
}: AddToCartSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(sizes.length === 1 ? sizes[0].id : '');
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);

  const handleAddToCart = () => {
    if (sizes.length > 1 && !selectedSize) {
      return;
    }

    onAddToCart?.(quantity, selectedSize);
  };

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium text-foreground">Select Option:</label>
            {showSizeGuide && (
              <button
                onClick={() => setShowSizeGuideModal(true)}
                className="flex items-center space-x-1 text-sm font-medium text-primary transition-luxe hover:text-accent"
              >
                <Icon name="InformationCircleIcon" size={16} />
                <span>Option Guide</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => size.available && setSelectedSize(size.id)}
                disabled={!size.available}
                className={`rounded-md border-2 px-4 py-3 font-medium transition-luxe ${
                  selectedSize === size.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : size.available
                      ? 'border-border text-foreground hover:border-primary'
                      : 'cursor-not-allowed border-border text-muted-foreground opacity-50'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="font-medium text-foreground">Quantity:</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center rounded-md border-2 border-border">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="p-3 transition-luxe hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Icon name="MinusIcon" size={20} className="text-foreground" />
            </button>
            <span className="min-w-[60px] px-6 text-center text-data text-lg font-medium text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
              disabled={quantity >= 10}
              className="p-3 transition-luxe hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Icon name="PlusIcon" size={20} className="text-foreground" />
            </button>
          </div>
          <span className="text-caption text-muted-foreground">Max 10 per order</span>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="flex w-full items-center justify-center space-x-2 rounded-md bg-primary px-6 py-4 text-lg font-medium text-primary-foreground transition-luxe hover:scale-102 hover:shadow-warm-md"
      >
        <Icon name="ShoppingBagIcon" size={24} />
        <span>Add to Cart</span>
      </button>

      <button className="w-full rounded-md bg-accent px-6 py-4 text-lg font-medium text-accent-foreground transition-luxe hover:scale-102 hover:shadow-warm-md">
        Buy Now
      </button>

      {showSizeGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
          onClick={() => setShowSizeGuideModal(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card shadow-warm-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-heading text-2xl font-semibold text-foreground">Option Guide</h2>
              <button
                onClick={() => setShowSizeGuideModal(false)}
                className="rounded-full p-2 transition-luxe hover:bg-muted"
                aria-label="Close size guide"
              >
                <Icon name="XMarkIcon" size={24} className="text-foreground" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium text-foreground">Available Options</h3>
                <p className="text-caption text-muted-foreground">
                  Each option represents product variant from catalog. Choose variant before adding
                  to cart.
                </p>
              </div>
              <div className="space-y-3">
                {sizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <span className="font-medium text-foreground">{size.label}</span>
                    <span className={size.available ? 'text-success' : 'text-error'}>
                      {size.available ? 'Available' : 'Out of stock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartSection;
