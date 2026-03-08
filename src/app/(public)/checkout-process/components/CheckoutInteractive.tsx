'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutProgress from './CheckoutProgress';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
}

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  deliveryOption: string;
  giftWrapping: boolean;
  giftMessage: string;
}

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  billingAddressSame: boolean;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
}

const CheckoutInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockCartItems: CartItem[] = [
    {
      id: '1',
      name: 'Rose Gold Pendant Necklace',
      price: 89.99,
      quantity: 1,
      image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      alt: 'Elegant rose gold pendant necklace with delicate chain on white background',
    },
    {
      id: '2',
      name: 'Crystal Drop Earrings',
      price: 49.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
      alt: 'Sparkling crystal drop earrings with silver setting displayed on jewelry stand',
    },
  ];

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingData?.deliveryOption === 'express' ? 12.99 : shippingData?.deliveryOption === 'overnight' ? 24.99 : 5.99;
  const giftWrappingCost = shippingData?.giftWrapping ? 4.99 : 0;

  const handleShippingNext = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentNext = (data: PaymentFormData) => {
    setPaymentData(data);
    const generatedOrderNumber = `JC${Date.now().toString().slice(-8)}`;
    setOrderNumber(generatedOrderNumber);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentBack = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPromo = (code: string) => {
    const validPromoCodes: Record<string, number> = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'FIRST15': 15,
    };

    if (validPromoCodes[code]) {
      setPromoCode(code);
      setDiscount(validPromoCodes[code]);
    }
  };

  const handleContinueShopping = () => {
    router.push('/homepage');
  };

  const getEstimatedDelivery = () => {
    if (!isHydrated) return 'Calculating...';
    
    const today = new Date();
    const deliveryDays = shippingData?.deliveryOption === 'overnight' ? 1 : shippingData?.deliveryOption === 'express' ? 3 : 7;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep < 3 && <CheckoutProgress currentStep={currentStep} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm onNext={handleShippingNext} initialData={shippingData || undefined} />
            )}
            {currentStep === 2 && (
              <PaymentForm
                onNext={handlePaymentNext}
                onBack={handlePaymentBack}
                initialData={paymentData || undefined}
              />
            )}
            {currentStep === 3 && (
              <OrderConfirmation
                orderNumber={orderNumber}
                email={shippingData?.email || ''}
                estimatedDelivery={getEstimatedDelivery()}
                onContinueShopping={handleContinueShopping}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep < 3 && (
            <div className="lg:col-span-1">
              <OrderSummary
                items={mockCartItems}
                subtotal={subtotal}
                shipping={shippingCost}
                giftWrapping={giftWrappingCost}
                promoCode={promoCode}
                discount={discount}
                onApplyPromo={handleApplyPromo}
                isSticky={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutInteractive;