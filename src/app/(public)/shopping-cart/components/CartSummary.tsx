'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { Cart } from '@/types/cart';

interface CartSummaryProps {
  cart: Cart;
  onProceedToCheckout: () => void;
}

const CartSummary = ({ cart, onProceedToCheckout }: CartSummaryProps) => {
  return (
    <div className="bg-card border border-border rounded-md p-6 sticky top-20">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Order Summary</h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-foreground">
            Subtotal{' '}
            <span className="text-muted-foreground text-sm">({cart.itemCount} items)</span>
          </span>
          <span className="text-data font-medium text-foreground">₹{cart.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Shipping</span>
          <span className="text-data font-medium text-success">FREE</span>
        </div>
        {cart.discountTotal > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Discount</span>
            <span className="text-data font-medium">-₹{cart.discountTotal.toFixed(2)}</span>
          </div>
        )}
        {cart.appliedPromoCodes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {cart.appliedPromoCodes.map((code) => (
              <span
                key={code}
                className="text-xs px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded-full"
              >
                {code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-heading text-lg font-semibold text-foreground">Total</span>
        <span className="text-data text-2xl font-bold text-primary">₹{cart.total.toFixed(2)}</span>
      </div>

      {/* Unavailable items warning */}
      {cart.hasUnavailableItems && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-md text-sm text-warning">
          <Icon name="ExclamationTriangleIcon" size={16} className="flex-shrink-0 mt-0.5" />
          <span>Some items are unavailable. Please review before checkout.</span>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={onProceedToCheckout}
        disabled={cart.hasUnavailableItems}
        className="w-full h-12 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Proceed to Checkout
        <Icon name="ArrowRightIcon" size={20} />
      </button>

      {cart.hasUnavailableItems && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Remove unavailable items to continue
        </p>
      )}

      {/* Trust Signals */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={16} className="text-success" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="TruckIcon" size={16} className="text-success" />
          <span>Free shipping on all orders</span>
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
