'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

type PaymentStatus = 'paid' | 'failed' | 'cancelled' | 'pending';

interface StatusConfig {
  icon: string;
  iconColor: string;
  iconBg: string;
  heading: string;
  message: string;
  statusLabel: string;
  statusBadgeClass: string;
}

const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  paid: {
    icon: 'CheckCircleIcon',
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
    heading: 'Payment Successful!',
    message:
      "Your payment was confirmed and your order is being prepared. We'll notify you once it ships.",
    statusLabel: 'PAID',
    statusBadgeClass: 'bg-success/10 text-success',
  },
  failed: {
    icon: 'XCircleIcon',
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
    heading: 'Payment Failed',
    message:
      'Your payment could not be processed. Your order has been saved — you can retry payment or contact support.',
    statusLabel: 'FAILED',
    statusBadgeClass: 'bg-destructive/10 text-destructive',
  },
  cancelled: {
    icon: 'XMarkIcon',
    iconColor: 'text-muted-foreground',
    iconBg: 'bg-muted',
    heading: 'Payment Cancelled',
    message: 'You closed the payment window. Your order has been saved and is awaiting payment.',
    statusLabel: 'PENDING',
    statusBadgeClass: 'bg-warning/10 text-warning',
  },
  pending: {
    icon: 'ClockIcon',
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    heading: 'Payment Pending',
    message:
      "We're waiting to confirm your payment. This usually resolves in a few minutes. If it doesn't, contact support with your order number.",
    statusLabel: 'PENDING',
    statusBadgeClass: 'bg-warning/10 text-warning',
  },
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();

  const rawStatus = searchParams.get('status') ?? 'pending';
  const paymentId = searchParams.get('paymentId');
  const orderNumber = searchParams.get('orderNumber');

  const status: PaymentStatus =
    rawStatus === 'paid' || rawStatus === 'failed' || rawStatus === 'cancelled'
      ? rawStatus
      : 'pending';

  const config = STATUS_CONFIG[status];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-md shadow-warm-lg p-6 sm:p-8 text-center">
        {/* Status icon */}
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 ${config.iconBg}`}
        >
          <Icon name={config.icon} size={40} className={config.iconColor} />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {config.heading}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{config.message}</p>

        {/* Order details card */}
        <div className="bg-muted/30 rounded-md p-5 mb-8 text-left space-y-4">
          {/* Order number + status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="text-data text-lg font-semibold text-foreground">
                {orderNumber ? `#${orderNumber}` : 'Pending confirmation'}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${config.statusBadgeClass}`}
            >
              {config.statusLabel}
            </span>
          </div>

          {/* Payment ID — only shown on paid */}
          {status === 'paid' && paymentId && (
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-1">Payment ID</p>
              <p className="text-sm font-mono text-foreground break-all">{paymentId}</p>
            </div>
          )}
        </div>

        {/* Status steps */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="border border-border rounded-md p-4">
            <Icon
              name="ClipboardDocumentCheckIcon"
              size={28}
              className="mx-auto text-primary mb-2"
            />
            <p className="text-xs font-medium text-foreground">Order Placed</p>
          </div>
          <div className="border border-border rounded-md p-4">
            <Icon
              name={status === 'paid' ? 'CheckBadgeIcon' : 'CreditCardIcon'}
              size={28}
              className={`mx-auto mb-2 ${status === 'paid' ? 'text-success' : 'text-muted-foreground'}`}
            />
            <p className="text-xs font-medium text-foreground">
              {status === 'paid' ? 'Payment Confirmed' : 'Payment Pending'}
            </p>
          </div>
          <div className="border border-border rounded-md p-4">
            <Icon
              name="TruckIcon"
              size={28}
              className={`mx-auto mb-2 ${status === 'paid' ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <p className="text-xs font-medium text-foreground">
              {status === 'paid' ? 'Being Prepared' : 'Ships After Payment'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
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
}

export default function OrderConfirmationInteractive() {
  return (
    <Suspense fallback={<div className="h-96 rounded-md bg-muted animate-pulse" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
