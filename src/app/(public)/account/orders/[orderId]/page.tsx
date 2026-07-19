'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/common/Header';
import AccountSidebar from '@/components/account/AccountSidebar';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { getOrderDetail, getApiMessage } from '@/lib/api/ordersApi';
import { resolveImageSrc } from '@/lib/image';
import {
  OrderDetail,
  OrderEvent,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  OrderShippingAddress,
} from '@/types/orders';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAuthError(msg: string): boolean {
  return /unauthorized|jwt|token|forbidden/i.test(msg);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

function formatCurrency(n: number): string {
  return `₹${n.toFixed(2)}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-primary/10 text-primary',
  default: 'bg-muted text-muted-foreground',
};

const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  PROCESSING: { label: 'Processing', variant: 'info' },
  SHIPPED: { label: 'Shipped', variant: 'info' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
  REFUNDED: { label: 'Refunded', variant: 'default' },
};

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Payment Pending', variant: 'warning' },
  PAID: { label: 'Paid', variant: 'success' },
  FAILED: { label: 'Payment Failed', variant: 'error' },
  REFUNDED: { label: 'Refunded', variant: 'default' },
  PARTIALLY_REFUNDED: { label: 'Partially Refunded', variant: 'warning' },
};

function StatusBadge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}

// ─── Order status steps ───────────────────────────────────────────────────────

const STATUS_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'PENDING', label: 'Order Placed', icon: 'ClipboardDocumentCheckIcon' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: 'CheckBadgeIcon' },
  { status: 'PROCESSING', label: 'Processing', icon: 'CogIcon' },
  { status: 'SHIPPED', label: 'Shipped', icon: 'TruckIcon' },
  { status: 'DELIVERED', label: 'Delivered', icon: 'HomeIcon' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
  REFUNDED: -1,
};

interface OrderProgressProps {
  status: OrderStatus;
}

function OrderProgress({ status }: OrderProgressProps) {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    const isCancelled = status === 'CANCELLED';
    return (
      <div
        className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ${
          isCancelled ? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon name={isCancelled ? 'XCircleIcon' : 'ArrowPathIcon'} size={18} />
        {isCancelled ? 'This order has been cancelled.' : 'This order has been refunded.'}
      </div>
    );
  }

  const currentIdx = STATUS_ORDER[status] ?? 0;

  return (
    <div className="relative flex items-start justify-between gap-1 sm:gap-2">
      {/* connector line */}
      <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" aria-hidden />
      <div
        className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-500"
        style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
        aria-hidden
      />

      {STATUS_STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.status} className="relative z-10 flex flex-1 flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-luxe ${
                done || active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground'
              }`}
            >
              <Icon name={step.icon} size={16} />
            </div>
            <p
              className={`text-center text-xs font-medium leading-tight ${
                done || active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Product item card ────────────────────────────────────────────────────────

function ItemCard({ item }: { item: OrderItem }) {
  const imageUrl = resolveImageSrc(
    item.product.imageUrl ||
      item.product.images?.find((img) => img.featureImage)?.imageUrl ||
      item.product.images?.[0]?.imageUrl
  );

  const categoryLabel = item.product.category
    ? item.product.category.parent
      ? `${item.product.category.parent.name} › ${item.product.category.name}`
      : item.product.category.name
    : null;

  return (
    <div className="flex items-start gap-4 rounded-md border border-border bg-card p-4 sm:p-5">
      {/* Image */}
      <Link
        href={`/product-detail/${item.product.productId}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:h-28 sm:w-28"
      >
        <AppImage
          src={imageUrl}
          alt={item.product.name}
          fill
          className="object-cover transition-luxe hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="min-w-0 flex-1">
        {categoryLabel && (
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {categoryLabel}
          </p>
        )}
        <Link
          href={`/product-detail/${item.product.productId}`}
          className="line-clamp-2 text-base font-semibold text-foreground hover:text-primary transition-luxe leading-snug"
        >
          {item.product.name}
        </Link>
        {item.variant?.name && item.variant.name !== 'Default' && (
          <p className="mt-0.5 text-sm text-muted-foreground">{item.variant.name}</p>
        )}
        {item.variant?.sku && (
          <p className="mt-0.5 text-xs text-muted-foreground">SKU: {item.variant.sku}</p>
        )}

        {/* Price row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="text-xs text-muted-foreground">
            {item.quantity} × {formatCurrency(item.unitPrice)}
          </div>
          <div className="text-sm font-bold text-foreground">{formatCurrency(item.lineTotal)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Address block ────────────────────────────────────────────────────────────

function AddressBlock({ address }: { address: OrderShippingAddress }) {
  return (
    <div className="rounded-md border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon name="MapPinIcon" size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Delivery Address</h3>
        {address.label && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {address.label}
          </span>
        )}
      </div>
      <p className="font-medium text-foreground">{address.fullName}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
      </p>
      <p className="text-sm text-muted-foreground">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-sm text-muted-foreground">{address.country}</p>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon name="PhoneIcon" size={13} />
        {address.phone}
      </p>
    </div>
  );
}

// ─── Price summary ────────────────────────────────────────────────────────────

interface PriceSummaryProps {
  order: OrderDetail;
  /** When set, show only the price breakdown for this single item */
  focusedItem?: OrderItem | null;
}

function PriceSummary({ order, focusedItem }: PriceSummaryProps) {
  // Focused view: derive totals purely from the single item — no delivery charge
  if (focusedItem) {
    const itemSubtotal = focusedItem.lineTotal;
    return (
      <div className="rounded-md border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon name="ReceiptPercentIcon" size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Price Details</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {focusedItem.quantity} × {formatCurrency(focusedItem.unitPrice)}
            </span>
            <span className="font-medium text-foreground">{formatCurrency(itemSubtotal)}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="font-heading text-base font-semibold text-foreground">Item Total</span>
          <span className="text-data text-lg font-bold text-primary">
            {formatCurrency(itemSubtotal)}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="InformationCircleIcon" size={13} />
          Delivery charges apply to the full order
        </p>
      </div>
    );
  }

  // Full order view
  return (
    <div className="rounded-md border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon name="ReceiptPercentIcon" size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Price Details</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({order.itemCount} {order.itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-foreground">{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discountTotal > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span className="font-medium">−{formatCurrency(order.discountTotal)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery charges</span>
          <span className="font-medium text-foreground">
            {order.shippingTotal === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatCurrency(order.shippingTotal)
            )}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="font-heading text-base font-semibold text-foreground">Total Amount</span>
        <span className="text-data text-lg font-bold text-primary">
          {formatCurrency(order.total)}
        </span>
      </div>
      {order.discountTotal > 0 && (
        <p className="mt-2 text-xs font-medium text-success">
          You saved {formatCurrency(order.discountTotal)} on this order
        </p>
      )}
    </div>
  );
}

// ─── Order timeline ───────────────────────────────────────────────────────────

function OrderTimeline({ events }: { events: OrderEvent[] }) {
  if (!events?.length) return null;

  return (
    <div className="rounded-md border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon name="ClockIcon" size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Order Timeline</h3>
      </div>
      <ol className="relative space-y-4 border-l border-border pl-5">
        {events.map((event, idx) => (
          <li key={event.eventId} className="relative">
            <span
              className={`absolute -left-[1.375rem] flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                idx === 0 ? 'border-primary bg-primary' : 'border-border bg-background'
              }`}
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {event.eventType.replace(/_/g, ' ')}
            </p>
            {event.description && (
              <p className="mt-0.5 text-sm text-foreground">{event.description}</p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDateTime(event.createdAt)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-28 rounded-md bg-muted" />
      <div className="h-36 rounded-md bg-muted" />
      <div className="h-36 rounded-md bg-muted" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="h-48 rounded-md bg-muted" />
        <div className="h-48 rounded-md bg-muted" />
      </div>
    </div>
  );
}

// ─── Inner page content (needs useSearchParams → must be in Suspense) ─────────

function OrderDetailContent() {
  const params = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = parseInt(params.orderId, 10);
  const orderItemId = searchParams.get('orderItemId')
    ? parseInt(searchParams.get('orderItemId')!, 10)
    : undefined;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  // isFocused is purely driven by the URL param — don't wait for API to decide
  const isFocused = orderItemId != null;

  const loadOrder = useCallback(async () => {
    const res = await getOrderDetail(orderId, orderItemId);
    const ok = (res as { status: number | boolean }).status === 200 || res.status === true;
    if (!ok) throw new Error(res.message);
    setOrder(res.data);
  }, [orderId, orderItemId]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast.error('Please sign in to view your orders');
      router.push('/login?redirect=/account/orders');
      return;
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        await loadOrder();
      } catch (error) {
        const message = getApiMessage(error, 'Failed to load order');
        if (isAuthError(message)) {
          toast.error('Session expired. Please sign in.');
          router.push('/login?redirect=/account/orders');
          return;
        }
        // 404 = order not found or belongs to another user
        if (/404|not found/i.test(message)) {
          toast.error('Order not found');
          router.replace('/account/orders');
          return;
        }
        toast.error(message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [loadOrder, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 lg:pt-24">
          <div className="px-4 py-4 border-b border-border sm:px-6 lg:px-8 animate-pulse">
            <div className="h-4 w-64 rounded bg-muted" />
          </div>
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
            <div className="hidden lg:block lg:w-72 shrink-0 border-r border-border bg-background" />
            <div className="flex-1 min-w-0 px-4 pt-8 pb-12 sm:px-8 lg:px-12">
              <div className="mb-8 h-8 w-56 rounded bg-muted animate-pulse" />
              <DetailSkeleton />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) return null;

  const orderStatus = ORDER_STATUS_MAP[order.status] ?? {
    label: order.status,
    variant: 'default' as BadgeVariant,
  };
  const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus] ?? {
    label: order.paymentStatus,
    variant: 'default' as BadgeVariant,
  };

  const focusedItem = isFocused ? (order.items[0] ?? null) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="px-4 py-4 border-b border-border sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-luxe">
              Home
            </Link>
            <Icon name="ChevronRightIcon" size={14} />
            <Link href="/account/orders" className="hover:text-primary transition-luxe">
              My Orders
            </Link>
            <Icon name="ChevronRightIcon" size={14} />
            {isFocused ? (
              <>
                <Link
                  href={`/account/orders/${order.orderId}`}
                  className="hover:text-primary transition-luxe"
                >
                  #{order.orderNumber}
                </Link>
                <Icon name="ChevronRightIcon" size={14} />
                <span className="max-w-[160px] truncate text-foreground">
                  {focusedItem?.product.name}
                </span>
              </>
            ) : (
              <span className="text-foreground">#{order.orderNumber}</span>
            )}
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
          <AccountSidebar active="orders" />

          <div className="flex-1 min-w-0 px-4 pt-8 pb-12 sm:px-8 lg:px-12">
            {/* Page heading */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl font-bold text-foreground lg:text-2xl">
                    {isFocused ? focusedItem?.product.name : `Order #${order.orderNumber}`}
                  </h1>
                </div>
                {isFocused && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    From order{' '}
                    <Link
                      href={`/account/orders/${order.orderId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge label={orderStatus.label} variant={orderStatus.variant} />
                  <StatusBadge label={paymentStatus.label} variant={paymentStatus.variant} />
                  <span className="text-xs text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>

              {/* Back link — if focused, go back to full order; else go to order list */}
              <Link
                href={isFocused ? `/account/orders/${order.orderId}` : '/account/orders'}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted transition-luxe self-start"
              >
                <Icon name="ArrowLeftIcon" size={16} />
                {isFocused ? 'All items in order' : 'All orders'}
              </Link>
            </div>

            {/* Order progress tracker */}
            <div className="mb-6 rounded-md border border-border bg-card p-4 sm:p-6">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Order Status</h2>
              <OrderProgress status={order.status} />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Left column: items + timeline */}
              <div className="space-y-4 lg:col-span-2">
                {/* Products */}
                <div className="space-y-3">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon name="ShoppingBagIcon" size={16} className="text-primary" />
                    {isFocused ? 'Item Details' : `Items (${order.items.length})`}
                  </h2>
                  {order.items.map((item) => (
                    <ItemCard key={item.orderItemId} item={item} />
                  ))}
                </div>

                {/* Timeline (only on full order view) */}
                {!isFocused && order.events?.length > 0 && <OrderTimeline events={order.events} />}

                {/* Notes */}
                {order.notes && (
                  <div className="rounded-md border border-border bg-card p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon name="ChatBubbleLeftEllipsisIcon" size={16} className="text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Order Notes</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Right column: address + price summary */}
              <div className="space-y-4">
                {order.shippingAddress && <AddressBlock address={order.shippingAddress} />}
                <PriceSummary order={order} focusedItem={isFocused ? focusedItem : null} />

                {/* On focused view, show timeline in the sidebar */}
                {isFocused && order.events?.length > 0 && <OrderTimeline events={order.events} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// useSearchParams must be wrapped in Suspense per Next.js App Router rules.

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20 lg:pt-24">
            <div className="px-4 py-4 border-b border-border sm:px-6 lg:px-8 animate-pulse">
              <div className="h-4 w-64 rounded bg-muted" />
            </div>
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
              <div className="hidden lg:block lg:w-72 shrink-0 border-r border-border bg-background" />
              <div className="flex-1 min-w-0 px-4 pt-8 pb-12 sm:px-8 lg:px-12">
                <div className="mb-8 h-8 w-56 rounded bg-muted animate-pulse" />
                <DetailSkeleton />
              </div>
            </div>
          </main>
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
