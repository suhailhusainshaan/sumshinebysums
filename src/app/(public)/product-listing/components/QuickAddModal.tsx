'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    alt: string;
    category: string;
    requiresSize: boolean;
  } | null;
  onAddToCart: (productId: string, size?: string, quantity?: number) => void;
}

const QuickAddModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: QuickAddModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    if (product) {
      if (product.requiresSize && !selectedSize) {
        return;
      }
      onAddToCart(product.id, selectedSize, quantity);
      onClose();
      setSelectedSize('');
      setQuantity(1);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background z-modal-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-modal p-4">
        <div className="bg-card rounded-lg shadow-warm-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Quick Add to Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-foreground hover:text-primary transition-luxe"
              aria-label="Close modal"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-cover"
                    width={300}
                    height={300}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-caption text-muted-foreground mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                    {product.name}
                  </h3>
                  <p className="text-data text-2xl font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Size Selection */}
                {product.requiresSize && (
                  <div>
                    <label className="block font-medium text-foreground mb-3">
                      Select Size
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-md border-2 font-medium transition-luxe ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-card text-foreground hover:border-primary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div>
                  <label className="block font-medium text-foreground mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-luxe"
                      aria-label="Decrease quantity"
                    >
                      <Icon name="MinusIcon" size={20} />
                    </button>
                    <span className="text-data text-lg font-medium text-foreground w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="w-10 h-10 flex items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-luxe"
                      aria-label="Increase quantity"
                    >
                      <Icon name="PlusIcon" size={20} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.requiresSize && !selectedSize}
                  className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-md font-medium hover:scale-102 hover:shadow-warm-md disabled:opacity-50 disabled:cursor-not-allowed transition-luxe flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingBagIcon" size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickAddModal;