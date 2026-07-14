'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { CheckoutOrder } from '@/types/checkout';

interface OrderConfirmationProps {
  order: CheckoutOrder;
  /** Payment has been verified by the backend. */
  paymentVerified?: boolean;
  /** Razorpay payment ID, shown when verified. */
  razorpayPaymentId?: string;
  onContinueShopping: () => void;
}

const OrderConfirmation = ({
  order,
  paymentVerified = false,
  razorpayPaymentId,
  onContinueShopping,
}: OrderConfirmationProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-md shadow-warm-lg p-6 sm:p-8 text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 ${
            paymentVerified ? 'bg-success/10' : 'bg-warning/10'
          }`}
        >
          <Icon
            name={paymentVerified ? 'CheckCircleIcon' : 'ClockIcon'}
            size={40}
            className={paymentVerified ? 'text-success' : 'text-warning'}
          />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {paymentVerified ? 'Payment Successful' : 'Order Created'}
        </h2>
        <p className="text-muted-foreground mb-8">
          {paymentVerified
            ? "Your payment has been confirmed. We'll start preparing your order shortly."
            : 'Your order is pending payment. Use the order details below for the next payment step.'}
        </p>

        <div className="bg-muted/30 rounded-md p-5 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-caption text-muted-foreground mb-1">Order Number</p>
                <p className="text-data text-lg font-semibold text-foreground">
                  {order.orderNumber}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  paymentVerified
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }`}
              >
                {paymentVerified ? 'PAID' : order.paymentStatus}
              </span>
            </div>

            {paymentVerified && razorpayPaymentId && (
              <div className="border-t border-border pt-4">
                <p className="text-caption text-muted-foreground mb-1">Payment ID</p>
                <p className="text-data text-sm font-mono text-foreground break-all">
                  {razorpayPaymentId}
                </p>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-caption text-muted-foreground mb-1">Order Total</p>
              <p className="text-data text-xl font-bold text-primary">₹{order.total.toFixed(2)}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-caption text-muted-foreground mb-1">Deliver To</p>
              <p className="text-foreground font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="border border-border rounded-md p-4">
            <Icon
              name="ClipboardDocumentCheckIcon"
              size={28}
              className="mx-auto text-primary mb-2"
            />
            <p className="text-sm font-medium text-foreground">Order Placed</p>
          </div>
          <div className="border border-border rounded-md p-4">
            <Icon
              name={paymentVerified ? 'CheckBadgeIcon' : 'CreditCardIcon'}
              size={28}
              className={`mx-auto mb-2 ${paymentVerified ? 'text-success' : 'text-primary'}`}
            />
            <p className="text-sm font-medium text-foreground">
              {paymentVerified ? 'Payment Confirmed' : 'Payment Pending'}
            </p>
          </div>
          <div className="border border-border rounded-md p-4">
            <Icon name="TruckIcon" size={28} className="mx-auto text-primary mb-2" />
            <p className="text-sm font-medium text-foreground">
              {paymentVerified ? 'Being Prepared' : 'Ships After Payment'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            onClick={onContinueShopping}
            className="flex-1 bg-primary text-primary-foreground py-3 px-5 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center gap-2"
          >
            <Icon name="ShoppingBagIcon" size={20} />
            Continue Shopping
          </Link>
          <Link
            href="/contact-support"
            className="flex-1 bg-muted text-foreground py-3 px-5 rounded-md font-medium hover:bg-muted/80 transition-luxe flex items-center justify-center gap-2"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
