'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/common/Header';
import AccountSidebar from '@/components/account/AccountSidebar';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { getMyOrders, getApiMessage } from '@/lib/api/ordersApi';
import { resolveImageSrc } from '@/lib/image';
import { OrderSummary, OrderItem, OrderStatus, PaymentStatus } from '@/types/orders';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAuthError(message: string): boolean {
  return /unauthorized|jwt|token|forbidden/i.test(message);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

// ─── Status badge configs ─────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

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

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-primary/10 text-primary',
  default: 'bg-muted text-muted-foreground',
};

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
  size?: 'sm' | 'xs';
}

function StatusBadge({ label, variant, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${BADGE_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}

// ─── Order item row (single product in the order card) ────────────────────────

interface OrderItemRowProps {
  item: OrderItem;
  orderId: number;
  showDivider: boolean;
}

function OrderItemRow({ item, orderId, showDivider }: OrderItemRowProps) {
  const imageUrl = resolveImageSrc(
    item.product.imageUrl ||
      item.product.images?.find((img) => img.featureImage)?.imageUrl ||
      item.product.images?.[0]?.imageUrl,
  );

  const categoryLabel = item.product.category
    ? item.product.category.parent
      ? `${item.product.category.parent.name} › ${item.product.category.name}`
      : item.product.category.name
    : null;

  return (
    <>
      {showDivider && <div className="border-t border-border" />}
      <Link
        href={`/account/orders/${orderId}?orderItemId=${item.orderItemId}`}
        className="flex items-start gap-4 p-4 sm:p-5 hover:bg-muted/40 transition-luxe group"
      >
        {/* Product image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          <AppImage
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover transition-luxe group-hover:scale-105"
          />
        </div>

        {/* Product details */}
        <div className="min-w-0 flex-1">
          {categoryLabel && (
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {categoryLabel}
            </p>
          )}
          <p className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">
            {item.product.name}
          </p>
          {item.variant?.name && item.variant.name !== 'Default' && (
            <p className="mt-0.5 text-xs text-muted-foreground">{item.variant.name}</p>
          )}
          {item.variant?.sku && (
            <p className="mt-0.5 text-xs text-muted-foreground">SKU: {item.variant.sku}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>Qty: {item.quantity}</span>
            <span>×</span>
            <span>{formatCurrency(item.unitPrice)}</span>
          </div>
        </div>

        {/* Line total + arrow */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-sm font-bold text-foreground">{formatCurrency(item.lineTotal)}</span>
          <Icon
            name="ChevronRightIcon"
            size={16}
            className="text-muted-foreground transition-luxe group-hover:text-primary"
          />
        </div>
      </Link>
    </>
  );
}

// ─── Order card (one card per order, groups all items) ────────────────────────

interface OrderCardProps {
  order: OrderSummary;
}

function OrderCard({ order }: OrderCardProps) {
  const orderStatus = ORDER_STATUS_MAP[order.status] ?? { label: order.status, variant: 'default' as BadgeVariant };
  const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus] ?? {
    label: order.paymentStatus,
    variant: 'default' as BadgeVariant,
  };

  return (
    <article className="overflow-hidden rounded-md border border-border bg-card shadow-warm">
      {/* Order header */}
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <Link
            href={`/account/orders/${order.orderId}`}
            className="font-data text-sm font-semibold text-foreground hover:text-primary transition-luxe"
          >
            #{order.orderNumber}
          </Link>
          <StatusBadge label={orderStatus.label} variant={orderStatus.variant} />
          <StatusBadge label={paymentStatus.label} variant={paymentStatus.variant} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="CalendarDaysIcon" size={13} />
            {formatDate(order.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="ShoppingBagIcon" size={13} />
            {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
          </span>
          <span className="font-semibold text-foreground">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Items list */}
      <div className="divide-y divide-border">
        {order.items.map((item) => (
          <OrderItemRow
            key={item.orderItemId}
            item={item}
            orderId={order.orderId}
            showDivider={false}
          />
        ))}
      </div>

      {/* Footer — view full order */}
      <div className="border-t border-border px-4 py-3 sm:px-5">
        <Link
          href={`/account/orders/${order.orderId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-luxe"
        >
          View order details
          <Icon name="ArrowRightIcon" size={13} />
        </Link>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function OrdersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="overflow-hidden rounded-md border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border bg-muted/20 px-5 py-3">
            <div className="flex gap-3">
              <div className="h-4 w-36 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
          {[1, 2].map((j) => (
            <div key={j} className="flex items-start gap-4 border-b border-border p-5">
              <div className="h-20 w-20 shrink-0 rounded-md bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          ))}
          <div className="px-5 py-3">
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card py-24 text-center shadow-warm">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon name="ClipboardDocumentListIcon" size={36} className="text-muted-foreground" />
      </div>
      <h2 className="font-heading text-xl font-semibold text-foreground">No orders yet</h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        When you place an order it will appear here so you can track its progress.
      </p>
      <Link
        href="/product-listing"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe"
      >
        <Icon name="ShoppingBagIcon" size={18} />
        Start Shopping
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [orderCount, setOrderCount] = useState(0);

  const loadOrders = useCallback(async () => {
    const res = await getMyOrders();
    // status can be numeric 200 or boolean true depending on envelope shape
    const ok = (res as { status: number | boolean }).status === 200 || res.status === true;
    if (!ok) throw new Error(res.message);
    setOrders(res.data.orders ?? []);
    setOrderCount(res.data.orderCount ?? 0);
  }, []);

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
        await loadOrders();
      } catch (error) {
        const message = getApiMessage(error, 'Failed to load orders');
        if (isAuthError(message)) {
          toast.error('Please sign in to view your orders');
          router.push('/login?redirect=/account/orders');
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
  }, [loadOrders, router]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="px-4 py-4 border-b border-border sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-luxe">
              Home
            </Link>
            <Icon name="ChevronRightIcon" size={14} />
            <span className="text-foreground">My Orders</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-theme(spacing.24))]">
          <AccountSidebar active="orders" />

          <div className="flex-1 min-w-0 px-4 pt-8 pb-12 sm:px-8 lg:px-12">
            {/* Heading */}
            <div className="mb-8 flex items-baseline gap-3">
              <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
                My Orders
              </h1>
              {!loading && orderCount > 0 && (
                <span className="text-2xl font-bold text-primary lg:text-3xl">({orderCount})</span>
              )}
            </div>

            {loading ? (
              <OrdersSkeleton />
            ) : orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.orderId} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
