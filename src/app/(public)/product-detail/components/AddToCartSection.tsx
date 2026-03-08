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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (onAddToCart) {
      onAddToCart(quantity, selectedSize);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-foreground font-medium">Select Size:</label>
            {showSizeGuide && (
              <button
                onClick={() => setShowSizeGuideModal(true)}
                className="text-primary hover:text-accent text-sm font-medium transition-luxe flex items-center space-x-1"
              >
                <Icon name="InformationCircleIcon" size={16} />
                <span>Size Guide</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => size.available && setSelectedSize(size.id)}
                disabled={!size.available}
                className={`py-3 px-4 rounded-md border-2 font-medium transition-luxe ${
                  selectedSize === size.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : size.available
                    ? 'border-border hover:border-primary text-foreground'
                    : 'border-border text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-foreground font-medium">Quantity:</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border-2 border-border rounded-md">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-3 hover:bg-muted transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Icon name="MinusIcon" size={20} className="text-foreground" />
            </button>
            <span className="text-data text-lg font-medium text-foreground px-6 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
              className="p-3 hover:bg-muted transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Icon name="PlusIcon" size={20} className="text-foreground" />
            </button>
          </div>
          <span className="text-caption text-muted-foreground">Max 10 per order</span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-md font-medium text-lg hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center space-x-2"
      >
        <Icon name="ShoppingBagIcon" size={24} />
        <span>Add to Cart</span>
      </button>

      {/* Buy Now Button */}
      <button className="w-full bg-accent text-accent-foreground py-4 px-6 rounded-md font-medium text-lg hover:scale-102 hover:shadow-warm-md transition-luxe">
        Buy Now
      </button>

      {/* Size Guide Modal */}
      {showSizeGuideModal && (
        <div
          className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeGuideModal(false)}
        >
          <div
            className="bg-card rounded-lg shadow-warm-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Size Guide
              </h2>
              <button
                onClick={() => setShowSizeGuideModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-luxe"
                aria-label="Close size guide"
              >
                <Icon name="XMarkIcon" size={24} className="text-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-foreground font-medium">Size</th>
                      <th className="py-3 px-4 text-foreground font-medium">
                        Diameter (mm)
                      </th>
                      <th className="py-3 px-4 text-foreground font-medium">
                        Circumference (mm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['5', '6', '7', '8', '9'].map((size) => (
                      <tr key={size} className="border-b border-border">
                        <td className="py-3 px-4 text-foreground">{size}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {15.7 + parseInt(size) * 0.4}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {49.3 + parseInt(size) * 1.3}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium text-foreground mb-2">How to Measure:</h3>
                <p className="text-caption text-muted-foreground">
                  Wrap a string around your finger and mark where it overlaps. Measure the
                  length in millimeters and compare with the circumference column above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartSection;