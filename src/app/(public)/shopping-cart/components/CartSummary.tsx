'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { Cart } from '@/types/cart';

interface CartSummaryProps {
  cart: Cart;
  onProceedToCheckout: () => void;
}

const CartSummary = ({ cart, onProceedToCheckout }: CartSummaryProps) => {
  // GST placeholder — update rate when decided
  const GST_RATE = 0; // 0 = not applied yet
  const gstAmount = GST_RATE > 0 ? cart.subtotal * GST_RATE : 0;
  const grandTotal = cart.total + gstAmount;
  return (
    <div className="bg-card border border-border rounded-md p-5 lg:sticky lg:top-22">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-5">Order Summary</h2>

      {/* Point 2: Itemised bill */}
      <div className="mb-4 space-y-2">
        {cart.items.map((item) => (
          <div key={item.cartItemId} className="flex items-start justify-between gap-2 text-sm">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium line-clamp-1">{item.productName}</p>
              {item.variantName && (
                <p className="text-muted-foreground text-xs">{item.variantName}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {item.quantity > 1
                  ? `${item.quantity} × ₹${item.unitPrice.toFixed(2)}`
                  : `₹${item.unitPrice.toFixed(2)}`}
              </p>
            </div>
            <span className="text-data font-medium text-foreground whitespace-nowrap">
              ₹{item.lineTotal.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider + totals */}
      <div className="space-y-2 pt-4 border-t border-border mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-data font-medium text-foreground">₹{cart.subtotal.toFixed(2)}</span>
        </div>
        {cart.discountTotal > 0 && (
          <div className="flex items-center justify-between text-sm text-success">
            <span>Discount</span>
            <span className="text-data font-medium">-₹{cart.discountTotal.toFixed(2)}</span>
          </div>
        )}
        {cart.appliedPromoCodes.length > 0 && (
          <div className="flex flex-wrap gap-1">
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

        {/* Shipping */}
        <div className="pt-2 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-data font-medium text-foreground">
              ₹{cart.shippingCharge.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Standard Shipping via India Post
          </p>
          <p className="text-xs text-muted-foreground/70 italic">
            International shipping not available
          </p>
        </div>

        {/* GST — shown as placeholder, rate TBD */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            GST
            <span className="text-xs text-muted-foreground/60">(TBD)</span>
          </span>
          <span className="text-data font-medium text-muted-foreground">
            {GST_RATE > 0 ? `₹${gstAmount.toFixed(2)}` : '—'}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between mb-5 pt-3 border-t border-border">
        <span className="font-heading text-base font-semibold text-foreground">Total</span>
        <span className="text-data text-xl font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
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

      {/* Point 6: Continue Shopping */}
      {/*<Link*/}
      {/*  href="/product-listing"*/}
      {/*  className="mt-3 w-full h-10 flex items-center justify-center gap-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-luxe"*/}
      {/*>*/}
      {/*  <Icon name="ArrowLeftIcon" size={16} />*/}
      {/*  Continue Shopping*/}
      {/*</Link>*/}

      {/* Trust Signals */}
      <div className="mt-5 pt-5 border-t border-border space-y-2.5">
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={16} className="text-success" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="TruckIcon" size={16} className="text-primary" />
          <span>Standard shipping via India Post · ₹{cart.shippingCharge.toFixed(0)}</span>
        </div>
        {/*<div className="flex items-center gap-2 text-caption text-muted-foreground">*/}
        {/*  <Icon name="ArrowPathIcon" size={16} className="text-success" />*/}
        {/*  <span>30-day easy returns</span>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default CartSummary;
