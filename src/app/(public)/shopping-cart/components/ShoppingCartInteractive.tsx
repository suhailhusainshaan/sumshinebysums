'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

const breadcrumbItems = [{ label: 'Shop', path: '/product-listing' }, { label: 'Shopping Cart' }];

// Items shown in the empty cart "You might like" section
const recommendedProducts = [
  {
    id: '101',
    name: 'Crystal Stud Earrings',
    price: 2499,
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    alt: 'Sparkling crystal stud earrings on black velvet jewelry display',
    category: 'Earrings',
  },
  {
    id: '102',
    name: 'Gold Layered Necklace Set',
    price: 3850,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    alt: 'Three layered gold necklaces of varying lengths on white background',
    category: 'Necklaces',
  },
  {
    id: '103',
    name: 'Statement Ring Collection',
    price: 2999,
    image: 'https://images.pixabay.com/photo/2017/11/22/19/00/ring-2971782_1280.jpg',
    alt: 'Set of three statement rings with colorful gemstones on marble surface',
    category: 'Rings',
  },
  {
    id: '104',
    name: 'Charm Bracelet with Crystals',
    price: 3475,
    image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
    alt: 'Silver charm bracelet with multiple crystal charms on jewelry stand',
    category: 'Bracelets',
  },
];

const ShoppingCartInteractive = () => {
  const router = useRouter();
  const { cart, loading, error, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    setUpdatingItemId(cartItemId);
    try {
      const message = await updateItem(cartItemId, newQuantity);
      if (message === 'Quantity adjusted to available stock') {
        toast('Quantity adjusted to maximum available stock', {
          icon: 'ℹ️',
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    setUpdatingItemId(cartItemId);
    try {
      await removeItem(cartItemId);
      toast.success('Item removed from cart');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove item');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout-process');
  };

  // --- Loading skeleton ---
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded-md" />
                ))}
              </div>
              <div className="h-80 bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error && !cart) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Icon name="ExclamationCircleIcon" size={48} className="mx-auto text-error mb-4" />
          <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
            Could not load your cart
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchCart}
            className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 transition-luxe"
          >
            <Icon name="ArrowPathIcon" size={18} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // --- Empty cart ---
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <EmptyCart recommendedProducts={recommendedProducts} />
        </div>
      </div>
    );
  }

  // --- Cart with items ---
  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl sm:text-4xl font-bold text-foreground mb-1">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} · {cart.totalQuantity}{' '}
                {cart.totalQuantity === 1 ? 'piece' : 'pieces'} total
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 flex items-center gap-1.5 text-primary hover:text-primary/80 transition-luxe text-sm font-medium mt-1"
            >
              <Icon name="ArrowLeftIcon" size={16} />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
          {/* Clear cart — visible on all screen sizes */}
          <div className="mt-3">
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-error transition-luxe text-xs disabled:opacity-50"
            >
              <Icon name="TrashIcon" size={14} />
              {isClearing ? 'Clearing…' : 'Clear cart'}
            </button>
          </div>
        </div>

        {/* Unavailable items banner */}
        {cart.hasUnavailableItems && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-md">
            <Icon
              name="ExclamationTriangleIcon"
              size={20}
              className="text-warning flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium text-foreground text-sm">Some items are unavailable</p>
              <p className="text-caption text-muted-foreground mt-0.5">
                Review the items below and remove unavailable ones before proceeding to checkout.
              </p>
            </div>
          </div>
        )}

        {/* Main grid: items left, summary right on desktop; stacked on mobile */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                isUpdating={updatingItemId === item.cartItemId}
              />
            ))}
          </div>

          {/* Summary — natural flow on mobile (below items), sticky sidebar on desktop */}
          <div className="lg:col-span-1">
            <CartSummary cart={cart} onProceedToCheckout={handleProceedToCheckout} />
          </div>
        </div>

        {/* Guest Checkout Notice */}
        {/*<div className="mt-8 p-4 bg-muted rounded-md border border-border">*/}
        {/*  <div className="flex items-start gap-3">*/}
        {/*    <Icon*/}
        {/*      name="InformationCircleIcon"*/}
        {/*      size={20}*/}
        {/*      className="text-primary flex-shrink-0 mt-0.5"*/}
        {/*    />*/}
        {/*    <div>*/}
        {/*      <p className="text-sm font-medium text-foreground mb-1">Guest Checkout Available</p>*/}
        {/*      <p className="text-caption text-muted-foreground">*/}
        {/*        You can checkout as a guest or{' '}*/}
        {/*        <Link href="/login" className="text-primary hover:underline">*/}
        {/*          sign in to your account*/}
        {/*        </Link>{' '}*/}
        {/*        to save your cart and track orders.*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default ShoppingCartInteractive;
