'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem, { CartItemData } from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import ShippingCalculator from './ShippingCalculator';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

const ShoppingCartInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
    
    // Mock cart data
    const mockCartItems: CartItemData[] = [
      {
        id: '1',
        name: 'Elegant Rose Gold Necklace with Crystal Pendant',
        price: 45.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
        alt: 'Elegant rose gold necklace with teardrop crystal pendant on white marble surface',
        category: 'Necklaces',
        selectedOptions: {
          size: '18 inches',
          color: 'Rose Gold'
        },
        maxQuantity: 10
      },
      {
        id: '2',
        name: 'Vintage Pearl Drop Earrings',
        price: 32.50,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
        alt: 'Vintage style pearl drop earrings with gold hooks on velvet display',
        category: 'Earrings',
        selectedOptions: {
          color: 'Gold'
        },
        maxQuantity: 15
      },
      {
        id: '3',
        name: 'Delicate Chain Bracelet with Heart Charm',
        price: 28.75,
        quantity: 1,
        image: 'https://images.pixabay.com/photo/2017/08/01/00/38/jewelry-2562598_1280.jpg',
        alt: 'Delicate gold chain bracelet with small heart charm on white background',
        category: 'Bracelets',
        selectedOptions: {
          size: '7 inches',
          color: 'Gold'
        },
        maxQuantity: 12
      }
    ];

    setCartItems(mockCartItems);
  }, []);

  const recommendedProducts = [
    {
      id: '101',
      name: 'Crystal Stud Earrings',
      price: 24.99,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
      alt: 'Sparkling crystal stud earrings on black velvet jewelry display',
      category: 'Earrings'
    },
    {
      id: '102',
      name: 'Gold Layered Necklace Set',
      price: 38.50,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
      alt: 'Three layered gold necklaces of varying lengths on white background',
      category: 'Necklaces'
    },
    {
      id: '103',
      name: 'Statement Ring Collection',
      price: 29.99,
      image: 'https://images.pixabay.com/photo/2017/11/22/19/00/ring-2971782_1280.jpg',
      alt: 'Set of three statement rings with colorful gemstones on marble surface',
      category: 'Rings'
    },
    {
      id: '104',
      name: 'Charm Bracelet with Crystals',
      price: 34.75,
      image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
      alt: 'Silver charm bracelet with multiple crystal charms on jewelry stand',
      category: 'Bracelets'
    }
  ];

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleApplyPromoCode = (code: string) => {
    // Mock promo code validation
    if (code.toUpperCase() === 'SAVE10') {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setDiscount(subtotal * 0.1);
    }
  };

  const handleCalculateShipping = (country: string, state: string, zipCode: string) => {
    // Mock shipping calculation
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setShippingCost(subtotal >= 50 ? 0 : 5.99);
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout-process');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'Shopping Cart' }
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <EmptyCart recommendedProducts={recommendedProducts} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link
            href="/product-listing"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-luxe"
          >
            <Icon name="ArrowLeftIcon" size={20} />
            Continue Shopping
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Shipping Calculator - Mobile */}
            <div className="lg:hidden">
              <ShippingCalculator onCalculate={handleCalculateShipping} />
            </div>

            {/* Continue Shopping - Mobile */}
            <Link
              href="/product-listing"
              className="flex sm:hidden items-center justify-center gap-2 h-12 px-6 bg-secondary text-secondary-foreground rounded-md font-medium hover:scale-102 transition-luxe"
            >
              <Icon name="ArrowLeftIcon" size={20} />
              Continue Shopping
            </Link>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <CartSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              discount={discount}
              onApplyPromoCode={handleApplyPromoCode}
              onProceedToCheckout={handleProceedToCheckout}
            />

            {/* Shipping Calculator - Desktop */}
            <div className="hidden lg:block">
              <ShippingCalculator onCalculate={handleCalculateShipping} />
            </div>
          </div>
        </div>

        {/* Guest Checkout Notice */}
        <div className="mt-8 p-4 bg-muted rounded-md border border-border">
          <div className="flex items-start gap-3">
            <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Guest Checkout Available
              </p>
              <p className="text-caption text-muted-foreground">
                You can checkout as a guest or{' '}
                <Link href="/homepage" className="text-primary hover:underline">
                  sign in to your account
                </Link>
                {' '}to save your cart and track orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartInteractive;