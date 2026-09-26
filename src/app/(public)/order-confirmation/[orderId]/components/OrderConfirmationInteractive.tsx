'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { ReceiptPrinter, type ReceiptPrinterStage } from '@/components/common/ReceiptPrinter';
import { useCartStore } from '@/store/cartStore';
import { getOrderDetail, getApiMessage } from '@/lib/api/ordersApi';
import type { OrderDetail } from '@/types/orders';
// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return `₹${n.toFixed(2)}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ─── Non-paid status config ────────────────────────────────────────────────────

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

// ─── Divider ──────────────────────────────────────────────────────────────────

function ReceiptDivider({ dashed = false }: { dashed?: boolean }) {
  return (
    <div
      className={`my-3 border-t border-neutral-300 ${dashed ? 'border-dashed' : 'border-solid'}`}
    />
  );
}

// ─── Receipt content ──────────────────────────────────────────────────────────

function ReceiptContent({
  order,
  paymentId,
  fallbackOrderNumber,
}: {
  order: OrderDetail;
  paymentId: string | null;
  fallbackOrderNumber: string | null;
}) {
  const orderNumber = order.orderNumber ?? fallbackOrderNumber;

  return (
    <div className="text-[11px] leading-relaxed text-neutral-800">
      {/* Store header */}
      <div className="mb-4 text-center">
        <p className="text-[13px] font-bold tracking-widest uppercase text-neutral-900">
          Sumshine By Sums
        </p>
        <p className="mt-0.5 text-neutral-500">Order Receipt</p>
      </div>

      <ReceiptDivider />

      {/* Order meta */}
      <div className="space-y-1">
        {orderNumber && (
          <div className="flex justify-between gap-2">
            <span className="text-neutral-500">Order</span>
            <span className="font-semibold text-neutral-900">#{orderNumber}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-neutral-500">Date</span>
          <span className="text-neutral-900">{formatDateTime(order.createdAt)}</span>
        </div>
        {order.paymentMethod && (
          <div className="flex justify-between gap-2">
            <span className="text-neutral-500">Method</span>
            <span className="text-neutral-900">{capitalize(order.paymentMethod)}</span>
          </div>
        )}
        {paymentId && (
          <div className="flex justify-between gap-2">
            <span className="text-neutral-500">Txn ID</span>
            <span className="break-all text-right text-neutral-900 font-mono text-[9px] leading-relaxed">
              {paymentId}
            </span>
          </div>
        )}
      </div>

      <ReceiptDivider dashed />

      {/* Line items */}
      <div className="space-y-2">
        {order.items.map((item) => {
          const productName = item.product.name;
          const variantLabel = item.variant
            ? item.variant.name !== productName
              ? item.variant.name
              : item.variant.sku
            : null;

          return (
            <div key={item.orderItemId}>
              <div className="flex justify-between gap-2">
                <span className="flex-1 font-medium text-neutral-900 leading-snug">
                  {item.quantity} × {productName}
                </span>
                <span className="shrink-0 text-neutral-900">{formatCurrency(item.lineTotal)}</span>
              </div>
              {variantLabel && <p className="ml-4 text-[10px] text-neutral-500">{variantLabel}</p>}
              <p className="ml-4 text-[10px] text-neutral-400">
                {formatCurrency(item.unitPrice)} each
              </p>
            </div>
          );
        })}
      </div>

      <ReceiptDivider dashed />

      {/* Totals */}
      <div className="space-y-1">
        <div className="flex justify-between gap-2">
          <span className="text-neutral-500">Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discountTotal > 0 && (
          <div className="flex justify-between gap-2">
            <span className="text-neutral-500">Discount</span>
            <span className="text-green-700">−{formatCurrency(order.discountTotal)}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-neutral-500">Shipping</span>
          <span>{order.shippingTotal > 0 ? formatCurrency(order.shippingTotal) : 'Free'}</span>
        </div>
      </div>

      <ReceiptDivider />

      <div className="flex justify-between gap-2 text-[13px] font-bold text-neutral-900">
        <span>TOTAL</span>
        <span>{formatCurrency(order.total)}</span>
      </div>

      <ReceiptDivider dashed />

      {/* Footer */}
      <div className="mt-4 text-center space-y-1 text-neutral-400">
        <p>Thank you for your order! 🌟</p>
        <p>sumshinebysums.com</p>
      </div>
    </div>
  );
}

// ─── Paid state — animated receipt printer ────────────────────────────────────

function PaidView({
  order,
  orderLoading,
  paymentId,
  fallbackOrderNumber,
}: {
  order: OrderDetail | null;
  orderLoading: boolean;
  paymentId: string | null;
  fallbackOrderNumber: string | null;
}) {
  const [stage, setStage] = useState<ReceiptPrinterStage>('processing');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Once order data lands, drive the stage machine: processing → printing → complete
  useEffect(() => {
    if (orderLoading || !order) return;

    // processing → printing after a short beat
    timerRef.current = setTimeout(() => {
      setStage('printing');

      // printing → complete after the feed animation finishes (1.75 s)
      timerRef.current = setTimeout(() => {
        setStage('complete');
      }, 1850);
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [orderLoading, order]);

  // Build and download a clean PDF from order data — no DOM capture needed
  async function handleDownloadPDF() {
    if (!order && !fallbackOrderNumber) return;

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const lm = 20; // left margin
    const rm = 190; // right margin (210 - 20)
    let y = 20;

    const line = (text: string, x: number, size = 10, style: 'normal' | 'bold' = 'normal') => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.text(text, x, y);
    };

    const row = (left: string, right: string, size = 10, bold: boolean = false) => {
      const style = bold ? 'bold' : 'normal';
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.text(left, lm, y);
      doc.text(right, rm, y, { align: 'right' });
    };

    const divider = (dashed = false) => {
      y += 3;
      doc.setDrawColor(180, 180, 180);
      doc.setLineDashPattern(dashed ? [1, 2] : [], 0);
      doc.line(lm, y, rm, y);
      doc.setLineDashPattern([], 0);
      y += 5;
    };

    const orderNumber = order?.orderNumber ?? fallbackOrderNumber;

    // Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMSHINE BY SUMS', 105, y, { align: 'center' });
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('Order Receipt', 105, y, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 4;

    divider();

    // Order meta
    if (orderNumber) {
      row('Order', `#${orderNumber}`);
      y += 6;
    }
    if (order?.createdAt) {
      row('Date', formatDateTime(order.createdAt));
      y += 6;
    }
    if (order?.paymentMethod) {
      row('Method', capitalize(order.paymentMethod));
      y += 6;
    }
    if (paymentId) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Txn ID', lm, y);
      doc.setTextColor(0, 0, 0);
      doc.text(paymentId, rm, y, { align: 'right' });
      y += 6;
    }

    divider(true);

    // Line items
    if (order?.items) {
      for (const item of order.items) {
        const label = `${item.quantity} × ${item.product.name}`;
        row(label, formatCurrency(item.lineTotal));
        y += 5;
        const variant = item.variant
          ? item.variant.name !== item.product.name
            ? item.variant.name
            : item.variant.sku
          : null;
        if (variant) {
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text(`  ${variant}`, lm, y);
          doc.setTextColor(0, 0, 0);
          y += 4;
        }
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(`  ${formatCurrency(item.unitPrice)} each`, lm, y);
        doc.setTextColor(0, 0, 0);
        y += 6;
      }
    }

    divider(true);

    // Totals
    if (order) {
      line('Subtotal', lm);
      doc.text(formatCurrency(order.subtotal), rm, y, { align: 'right' });
      y += 6;
      if (order.discountTotal > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Discount', lm, y);
        doc.setTextColor(34, 120, 34);
        doc.text(`-${formatCurrency(order.discountTotal)}`, rm, y, { align: 'right' });
        doc.setTextColor(0, 0, 0);
        y += 6;
      }
      line('Shipping', lm);
      doc.text(order.shippingTotal > 0 ? formatCurrency(order.shippingTotal) : 'Free', rm, y, {
        align: 'right',
      });
      y += 6;
    }

    divider();

    // Total
    row('TOTAL', order ? formatCurrency(order.total) : '', 12, true);
    y += 8;

    divider(true);

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text('Thank you for your order!', 105, y, { align: 'center' });
    y += 5;
    doc.text('sumshinebysums.com', 105, y, { align: 'center' });

    const filename = orderNumber ? `receipt-${orderNumber}.pdf` : 'receipt.pdf';
    doc.save(filename);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div id="receipt-print-area" className="w-full flex justify-center">
        <ReceiptPrinter.Root stage={stage} feedMotion="stepped" className="w-full max-w-[40rem]">
          <ReceiptPrinter.Machine>
            {/* ── Machine header: branding + success badge + nav ── */}
            <ReceiptPrinter.Header>
              {/* Left — branding pill */}
              <span className="shrink-0 rounded-full border border-border bg-muted/60 px-3 py-1 font-data text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Sumshine By Sums
              </span>

              {/* Centre — order placed badge (absolute so it doesn't push the pills apart) */}
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-row items-center gap-3 pointer-events-none">
                {/* Animated green check */}
                <div className="relative flex items-center justify-center w-11 h-11">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400/25 animate-ping" />
                  <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-green-700 shadow-[0_0_20px_rgba(34,197,94,0.45)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </div>
                <span className="font-heading text-3xl font-semibold text-foreground whitespace-nowrap">
                  Order Placed
                </span>
              </div>

              {/* Right — home button */}
              <Link
                href="/"
                className="shrink-0 flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 font-data text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-luxe"
              >
                <Icon name="HomeIcon" size={12} />
                Home
              </Link>
            </ReceiptPrinter.Header>

            {/* ── Order summary card — the "screen" area ── */}
            <ReceiptPrinter.Screen>
              <div className="flex flex-col gap-3">
                {/* Order name + total row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-data text-sm font-semibold text-foreground leading-tight truncate">
                      {order
                        ? order.items?.length === 1
                          ? order.items[0]?.product?.name || 'Your order'
                          : `${order.itemCount ?? order.items?.length ?? 0} item${
                              (order.itemCount ?? order.items?.length ?? 0) !== 1 ? 's' : ''
                            }`
                        : 'Your order'}
                    </p>
                    <p className="mt-0.5 font-data text-[11px] text-muted-foreground">
                      {order?.orderNumber
                        ? `#${order.orderNumber}`
                        : fallbackOrderNumber
                          ? `#${fallbackOrderNumber}`
                          : 'Processing…'}
                    </p>
                  </div>
                  {order && (
                    <div className="text-right shrink-0">
                      <p className="font-data text-[10px] text-muted-foreground mb-0.5">Total</p>
                      <p className="font-data text-lg font-bold text-foreground leading-none">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status row */}
                <ReceiptPrinter.Status>
                  {stage === 'complete' ? 'Order Placed' : undefined}
                </ReceiptPrinter.Status>
              </div>
            </ReceiptPrinter.Screen>

            <ReceiptPrinter.Output>
              <ReceiptPrinter.Paper>
                {order ? (
                  <ReceiptContent
                    order={order}
                    paymentId={paymentId}
                    fallbackOrderNumber={fallbackOrderNumber}
                  />
                ) : (
                  <div className="space-y-3 animate-pulse">
                    {[60, 40, 80, 50, 70, 55, 65].map((w, i) => (
                      <div
                        key={i}
                        className="h-2.5 rounded bg-neutral-200"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                )}
              </ReceiptPrinter.Paper>
            </ReceiptPrinter.Output>
          </ReceiptPrinter.Machine>
        </ReceiptPrinter.Root>
      </div>

      {/* Actions */}
      {stage === 'complete' && (
        <div className="w-full max-w-[40rem] flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border bg-card py-3 px-5 font-medium text-foreground hover:bg-muted/60 transition-luxe"
          >
            <Icon name="ArrowDownTrayIcon" size={18} />
            Download Receipt
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary py-3 px-5 font-medium text-primary-foreground hover:shadow-warm-md transition-luxe"
          >
            <Icon name="ShoppingBagIcon" size={18} />
            Continue Shopping
          </Link>
        </div>
      )}

      {/* Support link */}
      {stage === 'complete' && (
        <div className="w-full max-w-[40rem] text-center text-sm text-muted-foreground">
          {(order?.orderNumber ?? fallbackOrderNumber) && (
            <p className="mb-2 font-data text-xs">
              Order{' '}
              <span className="font-semibold text-foreground">
                #{order?.orderNumber ?? fallbackOrderNumber}
              </span>
            </p>
          )}
          <Link
            href="/contact-support"
            className="inline-flex items-center gap-1.5 text-xs hover:text-primary transition-luxe"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={14} />
            Need help? Contact support
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Non-paid states (unchanged card UI) ─────────────────────────────────────

function NonPaidView({
  status,
  paymentId,
  orderNumber,
}: {
  status: Exclude<PaymentStatus, 'paid'>;
  paymentId: string | null;
  orderNumber: string | null;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-md shadow-warm-lg p-6 sm:p-8 text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 ${config.iconBg}`}
        >
          <Icon name={config.icon} size={40} className={config.iconColor} />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {config.heading}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{config.message}</p>

        <div className="bg-muted/30 rounded-md p-5 mb-8 text-left space-y-4">
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

          {paymentId && (
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-1">Payment ID</p>
              <p className="text-sm font-mono text-foreground break-all">{paymentId}</p>
            </div>
          )}
        </div>

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
            <Icon name="CreditCardIcon" size={28} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs font-medium text-foreground">Payment Pending</p>
          </div>
          <div className="border border-border rounded-md p-4">
            <Icon name="TruckIcon" size={28} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs font-medium text-foreground">Ships After Payment</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 bg-primary text-primary-foreground py-3 px-5 rounded-md font-medium hover:shadow-warm-md transition-luxe flex items-center justify-center gap-2"
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

// ─── Main content (inside Suspense — uses useSearchParams + useParams) ─────────

function OrderConfirmationContent() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  const fetchCart = useCartStore((s) => s.fetchCart);

  const rawStatus = searchParams.get('status') ?? 'pending';
  const paymentId = searchParams.get('paymentId');
  const orderNumber = searchParams.get('orderNumber');

  const status: PaymentStatus =
    rawStatus === 'paid' || rawStatus === 'failed' || rawStatus === 'cancelled'
      ? rawStatus
      : 'pending';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [orderLoading, setOrderLoading] = useState(status === 'paid');

  // Re-fetch cart so the header badge reflects post-payment state.
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fetch order detail only for paid orders — other states don't need it.
  useEffect(() => {
    if (status !== 'paid') return;

    const id = parseInt(orderId, 10);
    if (isNaN(id)) {
      setOrderLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      setOrderLoading(true);
      try {
        const res = await getOrderDetail(id);
        const ok = (res as { status: number | boolean }).status === 200 || res.status === true;
        if (!ok) throw new Error(res.message);
        if (mounted) setOrder(res.data);
      } catch (err) {
        // Silently fall back — the receipt will still show with URL data
        console.warn('[OrderConfirmation] failed to load order detail:', getApiMessage(err));
      } finally {
        if (mounted) setOrderLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [orderId, status]);

  if (status === 'paid') {
    return (
      <div className="mx-auto w-full">
        <PaidView
          order={order}
          orderLoading={orderLoading}
          paymentId={paymentId}
          fallbackOrderNumber={orderNumber}
        />
      </div>
    );
  }

  return (
    <NonPaidView
      status={status as Exclude<PaymentStatus, 'paid'>}
      paymentId={paymentId}
      orderNumber={orderNumber}
    />
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function OrderConfirmationInteractive() {
  return (
    <Suspense fallback={<div className="h-96 rounded-md bg-muted animate-pulse" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
