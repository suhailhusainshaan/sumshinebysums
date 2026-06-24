'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { Address, CheckoutPreview, CheckoutPreviewItem } from '@/types/checkout';

interface OrderSummaryProps {
  preview: CheckoutPreview | null;
  selectedAddress: Address | null;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

function stockMessage(item: CheckoutPreviewItem): string {
  if (item.stockIssue === 'OUT_OF_STOCK') return 'This item is out of stock';
  if (item.stockIssue === 'INSUFFICIENT_STOCK') {
    return `Only ${item.availableStock} left in stock`;
  }
  if (item.stockIssue === 'PRODUCT_INACTIVE' || item.stockIssue === 'PRODUCT_UNPUBLISHED') {
    return 'This item is no longer available';
  }
  return '';
}

const OrderSummary = ({
  preview,
  selectedAddress,
  onPlaceOrder,
  isPlacingOrder,
}: OrderSummaryProps) => {
  const disabled = !preview || preview.hasUnavailableItems || isPlacingOrder;

  return (
    <div className="bg-card border border-border rounded-md p-5 lg:sticky lg:top-24">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-5">Checkout Summary</h2>

      {!selectedAddress && (
        <div className="mb-5 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          Select or add a delivery address to preview your order.
        </div>
      )}

      {preview ? (
        <>
          <div className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {preview.items.map((item) => (
              <div key={item.cartItemId} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground">{item.variantName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm font-semibold text-foreground">
                    ₹{item.lineTotal.toFixed(2)}
                  </span>
                </div>
                {!item.isAvailable && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-warning">
                    <Icon name="ExclamationTriangleIcon" size={14} />
                    {stockMessage(item)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">₹{preview.subtotal.toFixed(2)}</span>
            </div>
            {preview.discountTotal > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span className="font-medium">-₹{preview.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-foreground">
                ₹{preview.shippingTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-base font-semibold text-foreground">Total</span>
            <span className="text-data text-xl font-bold text-primary">
              ₹{preview.total.toFixed(2)}
            </span>
          </div>

          {preview.hasUnavailableItems && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
              <Icon name="ExclamationTriangleIcon" size={16} className="mt-0.5 flex-shrink-0" />
              <span>Some items cannot be ordered. Update your cart before placing the order.</span>
            </div>
          )}
        </>
      ) : (
        selectedAddress && (
          <div className="mb-5 h-40 rounded-md bg-muted animate-pulse" aria-label="Loading total" />
        )
      )}

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={disabled}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        <Icon name="ArrowRightIcon" size={20} />
      </button>

      <div className="mt-5 space-y-2.5 border-t border-border pt-5">
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={16} className="text-success" />
          <span>Secure authenticated checkout</span>
        </div>
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Icon name="TruckIcon" size={16} className="text-primary" />
          <span>Standard shipping across India</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
