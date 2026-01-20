'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartIconProps {
  cartItemCount?: number;
  cartItems?: CartItem[];
  onViewCart?: () => void;
}

const ShoppingCartIcon = ({
  cartItemCount = 0,
  cartItems = [],
  onViewCart,
}: ShoppingCartIconProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleMouseEnter = () => {
    if (cartItems.length > 0) {
      setShowPreview(true);
    }
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

  const handleViewCart = () => {
    setShowPreview(false);
    if (onViewCart) {
      onViewCart();
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/shopping-cart"
        className="relative p-2 text-foreground hover:text-primary transition-luxe inline-flex items-center"
        aria-label={`Shopping cart with ${cartItemCount} items`}
      >
        <Icon name="ShoppingBagIcon" size={24} />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount > 9 ? '9+' : cartItemCount}
          </span>
        )}
      </Link>

      {/* Cart Preview Dropdown */}
      {showPreview && cartItems.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-md shadow-warm-lg z-cart-preview">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading text-lg font-semibold text-popover-foreground">
              Shopping Cart
            </h3>
            <p className="text-caption text-muted-foreground">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {cartItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-4 border-b border-border hover:bg-muted transition-luxe"
              >
                <AppImage
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-popover-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-data text-sm font-medium text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-popover-foreground">Subtotal:</span>
              <span className="text-data text-lg font-semibold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/shopping-cart"
              onClick={handleViewCart}
              className="block w-full bg-primary text-primary-foreground text-center py-3 px-6 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartIcon;