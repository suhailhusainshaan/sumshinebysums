'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/AppIcon';
import { getApiMessage, getCheckoutPreview, initiateCheckout } from '@/lib/api/checkoutApi';
import { CheckoutOrder, CheckoutPreview, CheckoutPreviewItem } from '@/types/checkout';
import { useCartStore } from '@/store/cartStore';
import OrderConfirmation from '../../components/OrderConfirmation';

function needsAuth(errorMessage: string): boolean {
  return /unauthorized|jwt|token/i.test(errorMessage);
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

function CheckoutSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [notes, setNotes] = useState('');
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addressId = Number(searchParams.get('addressId'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in before checkout');
      router.push('/login?redirect=/checkout-process');
      return;
    }

    if (!Number.isFinite(addressId) || addressId <= 0) {
      toast.error('Select a delivery address first');
      router.push('/checkout-process');
      return;
    }

    let isMounted = true;
    async function loadPreview() {
      setLoading(true);
      try {
        const res = await getCheckoutPreview(addressId);
        if (!isMounted) return;
        if (!res.status) throw new Error(res.message);
        setPreview(res.data);
      } catch (error) {
        const message = getApiMessage(error, 'Failed to prepare order summary');
        if (needsAuth(message)) {
          toast.error('Please sign in before checkout');
          router.push('/login?redirect=/checkout-process');
          return;
        }
        toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPreview();

    return () => {
      isMounted = false;
    };
  }, [addressId, router]);

  const handleProceed = async () => {
    if (!preview) {
      toast.error('Order summary is not ready yet');
      return;
    }

    if (preview.hasUnavailableItems) {
      toast.error('Update your cart before proceeding');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await initiateCheckout(addressId, notes);
      if (!res.status) throw new Error(res.message);
      setOrder(res.data);
      await fetchCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to proceed to checkout'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (order) {
    return <OrderConfirmation order={order} onContinueShopping={() => router.push('/')} />;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 rounded-md bg-muted" />
          <div className="h-80 rounded-md bg-muted" />
        </div>
        <div className="h-80 rounded-md bg-muted" />
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="rounded-md border border-border bg-card p-8 text-center">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Order summary unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a delivery address again to refresh checkout.
        </p>
        <Link
          href="/checkout-process"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-foreground hover:scale-102 transition-luxe"
        >
          Choose Address
          <Icon name="ArrowRightIcon" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-card border border-border rounded-md p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Delivery Address
              </h2>
              <p className="mt-2 font-medium text-foreground">{preview.address.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {preview.address.line1}
                {preview.address.line2 ? `, ${preview.address.line2}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {preview.address.city}, {preview.address.state} {preview.address.postalCode}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{preview.address.phone}</p>
            </div>
            <Link
              href="/checkout-process"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-muted transition-luxe"
            >
              <Icon name="PencilSquareIcon" size={17} />
              Change
            </Link>
          </div>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">Items</h2>
              <p className="text-sm text-muted-foreground">
                {preview.itemCount} {preview.itemCount === 1 ? 'item' : 'items'} ·{' '}
                {preview.totalQuantity} {preview.totalQuantity === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
            {preview.hasUnavailableItems && (
              <Link
                href="/shopping-cart"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-warning/30 px-4 text-sm font-medium text-warning hover:bg-warning/10 transition-luxe"
              >
                Update Cart
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {preview.items.map((item) => (
              <div key={item.cartItemId} className="rounded-md border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.variantName || item.sku}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-data font-semibold text-foreground">
                    ₹{item.lineTotal.toFixed(2)}
                  </span>
                </div>
                {!item.isAvailable && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-warning">
                    <Icon name="ExclamationTriangleIcon" size={16} />
                    {stockMessage(item)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Order Notes</h2>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={300}
            className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
            placeholder="Please pack as a gift"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{notes.length}/300</p>
        </section>
      </div>

      <aside className="lg:col-span-1">
        <div className="bg-card border border-border rounded-md p-5 lg:sticky lg:top-24">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-5">
            Payment Summary
          </h2>
          <div className="space-y-3 text-sm">
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

          <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
            <span className="font-heading text-lg font-semibold text-foreground">Total</span>
            <span className="text-data text-2xl font-bold text-primary">
              ₹{preview.total.toFixed(2)}
            </span>
          </div>

          {preview.hasUnavailableItems && (
            <div className="mt-5 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
              <Icon name="ExclamationTriangleIcon" size={16} className="mt-0.5 flex-shrink-0" />
              <span>Some items cannot be ordered. Update your cart before proceeding.</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleProceed}
            disabled={preview.hasUnavailableItems || isSubmitting}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
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
      </aside>
    </div>
  );
}

export default function CheckoutSummaryInteractive() {
  return (
    <Suspense fallback={<div className="h-80 rounded-md bg-muted animate-pulse" />}>
      <CheckoutSummaryContent />
    </Suspense>
  );
}
