'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  discount: number;
  onApplyPromoCode: (code: string) => void;
  onProceedToCheckout: () => void;
}

const CartSummary = ({
  subtotal,
  shippingCost,
  discount,
  onApplyPromoCode,
  onProceedToCheckout,
}: CartSummaryProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const total = subtotal + shippingCost - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      onApplyPromoCode(promoCode);
      setPromoApplied(true);
    }
  };

  return (
    <div className="bg-card border border-border rounded-md p-6 sticky top-20">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
        Order Summary
      </h2>

      {/* Promo Code Input */}
      <div className="mb-6">
        <label htmlFor="promoCode" className="block text-sm font-medium text-foreground mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            id="promoCode"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 h-10 px-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim() || promoApplied}
            className="px-4 h-10 bg-secondary text-secondary-foreground rounded-md font-medium hover:scale-102 transition-luxe disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="text-caption text-success mt-2 flex items-center gap-1">
            <Icon name="CheckCircleIcon" size={16} />
            Promo code applied successfully
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Subtotal</span>
          <span className="text-data font-medium text-foreground">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Shipping</span>
          <span className="text-data font-medium text-foreground">
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Discount</span>
            <span className="text-data font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-heading text-lg font-semibold text-foreground">
          Total
        </span>
        <span className="text-data text-2xl font-bold text-primary">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onProceedToCheckout}
        className="w-full h-12 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <Icon name="ArrowRightIcon" size={20} />
      </button>

      {/* Trust Signals */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={16} className="text-success" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="TruckIcon" size={16} className="text-success" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="ArrowPathIcon" size={16} className="text-success" />
          <span>30-day easy returns</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;