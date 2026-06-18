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
    category?: string;
    variants: {
      id: string;
      name: string;
      price: number;
      stockQuantity: number;
    }[];
  } | null;
  onAddToCart: (productId: string, variantId?: string, quantity?: number) => void;
}

const QuickAddModal = ({ isOpen, onClose, product, onAddToCart }: QuickAddModalProps) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const requiresVariantSelection = (product?.variants.length || 0) > 1;
  const resolvedVariantId =
    selectedVariantId || (product?.variants.length === 1 ? product.variants[0].id : '');

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (requiresVariantSelection && !resolvedVariantId) {
      return;
    }

    onAddToCart(product.id, resolvedVariantId, quantity);
    onClose();
    setSelectedVariantId('');
    setQuantity(1);
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
      <div
        className="fixed inset-0 z-modal-overlay bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-ivory border border-mist shadow-warm-xl">
          <div className="flex items-center justify-between border-b border-mist p-6">
            <h2 className="font-display text-3xl tracking-wide text-ink">
              Quick Add to Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-ink transition-luxe hover:text-gold"
              aria-label="Close modal"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-1/3">
                <div className="aspect-[4/5] overflow-hidden bg-mist catchlight">
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    className="h-full w-full object-cover"
                    width={300}
                    height={300}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-ink/70">{product.category}</p>
                  <h3 className="mb-3 font-display text-2xl tracking-wide text-ink">
                    {product.name}
                  </h3>
                  <span className="font-medium tracking-wide text-ink">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>

                {requiresVariantSelection && (
                  <div>
                    <label className="mb-3 block text-xs uppercase tracking-widest text-ink">Select Option</label>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`border px-4 py-3 font-medium transition-luxe ${
                            selectedVariantId === variant.id
                              ? 'border-gold bg-gold text-porcelain'
                              : 'border-mist bg-porcelain text-ink hover:border-gold'
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-3 block text-xs uppercase tracking-widest text-ink">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center border border-mist bg-porcelain text-ink transition-luxe hover:bg-mist/30 hover:border-gold disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Icon name="MinusIcon" size={20} />
                    </button>
                    <span className="w-12 text-center font-medium text-ink">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="flex h-10 w-10 items-center justify-center border border-mist bg-porcelain text-ink transition-luxe hover:bg-mist/30 hover:border-gold disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Icon name="PlusIcon" size={20} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={requiresVariantSelection && !resolvedVariantId}
                  className="flex w-full items-center justify-center gap-2 border border-mist bg-velvet px-6 py-4 tracking-widest uppercase text-sm text-porcelain transition-luxe hover:bg-gold hover:border-gold hover:text-velvet disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="ShoppingBagIcon" size={18} />
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
