'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface StickyAddToCartProps {
  productName: string;
  price: number;
  onAddToCart?: () => void;
}

const StickyAddToCart = ({ productName, price, onAddToCart }: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-warm-lg z-sticky-cart lg:hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{productName}</p>
          <p className="text-data text-lg font-semibold text-primary">
            ${price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={onAddToCart}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:scale-102 transition-luxe flex items-center space-x-2 flex-shrink-0"
        >
          <Icon name="ShoppingBagIcon" size={20} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default StickyAddToCart;