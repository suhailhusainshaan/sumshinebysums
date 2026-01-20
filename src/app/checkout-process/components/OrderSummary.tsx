'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  giftWrapping: number;
  promoCode?: string;
  discount?: number;
  onApplyPromo?: (code: string) => void;
  isSticky?: boolean;
}

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  giftWrapping,
  promoCode,
  discount = 0,
  onApplyPromo,
  isSticky = false,
}: OrderSummaryProps) => {
  const [promoInput, setPromoInput] = React.useState(promoCode || '');
  const [showPromoInput, setShowPromoInput] = React.useState(false);

  const tax = subtotal * 0.08;
  const total = subtotal + shipping + giftWrapping + tax - discount;

  const handleApplyPromo = () => {
    if (onApplyPromo && promoInput.trim()) {
      onApplyPromo(promoInput.trim());
    }
  };

  return (
    <div
      className={`bg-card rounded-lg shadow-warm ${
        isSticky ? 'lg:sticky lg:top-24' : ''
      }`}
    >
      <div className="p-6 border-b border-border">
        <h2 className="font-heading text-xl font-semibold text-foreground">Order Summary</h2>
      </div>

      {/* Cart Items */}
      <div className="p-6 border-b border-border max-h-64 overflow-y-auto">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-data text-sm text-primary">${item.price.toFixed(2)}</p>
              </div>
              <p className="text-data font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="p-6 border-b border-border">
        {!showPromoInput && !promoCode ? (
          <button
            onClick={() => setShowPromoInput(true)}
            className="w-full flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-luxe"
          >
            <Icon name="TagIcon" size={20} />
            <span className="font-medium">Add promo code</span>
          </button>
        ) : (
          <div className="space-y-3">
            {promoCode ? (
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-md">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircleIcon" size={20} className="text-success" />
                  <span className="font-medium text-foreground">{promoCode}</span>
                </div>
                <span className="text-success font-medium">-${discount.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 h-10 px-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 transition-luxe"
                  >
                    Apply
                  </button>
                </div>
                <button
                  onClick={() => setShowPromoInput(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-luxe"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between text-foreground">
          <span>Subtotal</span>
          <span className="text-data">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-foreground">
          <span>Shipping</span>
          <span className="text-data">${shipping.toFixed(2)}</span>
        </div>
        {giftWrapping > 0 && (
          <div className="flex items-center justify-between text-foreground">
            <span>Gift Wrapping</span>
            <span className="text-data">${giftWrapping.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-foreground">
          <span>Tax (8%)</span>
          <span className="text-data">${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Discount</span>
            <span className="text-data">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-heading text-lg font-semibold text-foreground">Total</span>
            <span className="text-data text-2xl font-bold text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-1">
            <Icon name="ShieldCheckIcon" size={24} className="text-success" />
            <span className="text-caption text-muted-foreground">Secure</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Icon name="TruckIcon" size={24} className="text-primary" />
            <span className="text-caption text-muted-foreground">Fast Ship</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Icon name="ArrowPathIcon" size={24} className="text-primary" />
            <span className="text-caption text-muted-foreground">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;