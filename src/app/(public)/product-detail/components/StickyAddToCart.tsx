'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/AppIcon';
import { useCartStore } from '@/store/cartStore';

interface StickyAddToCartProps {
  productName: string;
  price: number;
  productId: number;
  variantId?: number;
}

const StickyAddToCart = ({ productName, price, productId, variantId }: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!variantId) {
      toast.error('Please select an option first');
      return;
    }
    setIsAdding(true);
    try {
      const message = await addItem(productId, variantId, 1);
      if (message === 'Quantity adjusted to available stock') {
        toast('Quantity adjusted to maximum available stock', { icon: 'ℹ️' });
      } else {
        toast.success('Added to cart!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-warm-lg z-sticky-cart lg:hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{productName}</p>
          <p className="text-data text-lg font-semibold text-primary">₹{price.toFixed(2)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:scale-102 transition-luxe flex items-center space-x-2 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isAdding ? (
            <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
          ) : (
            <Icon name="ShoppingBagIcon" size={20} />
          )}
          <span>{isAdding ? 'Adding…' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default StickyAddToCart;
