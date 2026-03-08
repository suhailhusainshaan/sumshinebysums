'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface PaymentFormProps {
  onNext: (data: PaymentFormData) => void;
  onBack: () => void;
  initialData?: Partial<PaymentFormData>;
}

const PaymentForm = ({ onNext, onBack, initialData }: PaymentFormProps) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: initialData?.cardNumber || '',
    cardName: initialData?.cardName || '',
    expiryDate: initialData?.expiryDate || '',
    cvv: initialData?.cvv || '',
    saveCard: initialData?.saveCard || false,
    billingAddressSame: initialData?.billingAddressSame ?? true,
    billingAddress: initialData?.billingAddress || '',
    billingCity: initialData?.billingCity || '',
    billingState: initialData?.billingState || '',
    billingZipCode: initialData?.billingZipCode || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    const cleanedCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    if (!formData.billingAddressSame) {
      if (!formData.billingAddress.trim()) {
        newErrors.billingAddress = 'Billing address is required';
      }
      if (!formData.billingCity.trim()) {
        newErrors.billingCity = 'City is required';
      }
      if (!formData.billingState.trim()) {
        newErrors.billingState = 'State is required';
      }
      if (!formData.billingZipCode.trim()) {
        newErrors.billingZipCode = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.billingZipCode)) {
        newErrors.billingZipCode = 'Invalid ZIP code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Badge */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3">
        <Icon name="ShieldCheckIcon" size={24} className="text-success" />
        <div>
          <p className="font-medium text-foreground">Secure Payment</p>
          <p className="text-caption text-muted-foreground">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CreditCardIcon" size={20} className="mr-2 text-primary" />
          Payment Information
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-1">
              Card Number *
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.cardNumber ? 'border-error' : 'border-border'
              }`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-error">{errors.cardNumber}</p>
            )}
          </div>
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-foreground mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              id="cardName"
              value={formData.cardName}
              onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.cardName ? 'border-error' : 'border-border'
              }`}
              placeholder="JOHN DOE"
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-error">{errors.cardName}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                  errors.expiryDate ? 'border-error' : 'border-border'
                }`}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-error">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-1">
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                  errors.cvv ? 'border-error' : 'border-border'
                }`}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-error">{errors.cvv}</p>
              )}
            </div>
          </div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.saveCard}
              onChange={(e) => handleInputChange('saveCard', e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-ring"
            />
            <span className="text-foreground">Save card for future purchases</span>
          </label>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="MapPinIcon" size={20} className="mr-2 text-primary" />
          Billing Address
        </h3>
        <label className="flex items-center space-x-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.billingAddressSame}
            onChange={(e) => handleInputChange('billingAddressSame', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-ring"
          />
          <span className="text-foreground">Same as shipping address</span>
        </label>
        {!formData.billingAddressSame && (
          <div className="space-y-4">
            <div>
              <label htmlFor="billingAddress" className="block text-sm font-medium text-foreground mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="billingAddress"
                value={formData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                  errors.billingAddress ? 'border-error' : 'border-border'
                }`}
                placeholder="123 Main Street"
              />
              {errors.billingAddress && (
                <p className="mt-1 text-sm text-error">{errors.billingAddress}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="billingCity" className="block text-sm font-medium text-foreground mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="billingCity"
                  value={formData.billingCity}
                  onChange={(e) => handleInputChange('billingCity', e.target.value)}
                  className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                    errors.billingCity ? 'border-error' : 'border-border'
                  }`}
                  placeholder="New York"
                />
                {errors.billingCity && (
                  <p className="mt-1 text-sm text-error">{errors.billingCity}</p>
                )}
              </div>
              <div>
                <label htmlFor="billingState" className="block text-sm font-medium text-foreground mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="billingState"
                  value={formData.billingState}
                  onChange={(e) => handleInputChange('billingState', e.target.value)}
                  className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                    errors.billingState ? 'border-error' : 'border-border'
                  }`}
                  placeholder="NY"
                />
                {errors.billingState && (
                  <p className="mt-1 text-sm text-error">{errors.billingState}</p>
                )}
              </div>
              <div>
                <label htmlFor="billingZipCode" className="block text-sm font-medium text-foreground mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="billingZipCode"
                  value={formData.billingZipCode}
                  onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                  className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                    errors.billingZipCode ? 'border-error' : 'border-border'
                  }`}
                  placeholder="10001"
                />
                {errors.billingZipCode && (
                  <p className="mt-1 text-sm text-error">{errors.billingZipCode}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-muted text-foreground py-4 px-6 rounded-md font-medium hover:bg-muted/80 transition-luxe flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowLeftIcon" size={20} />
          <span>Back to Shipping</span>
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground py-4 px-6 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center space-x-2"
        >
          <span>Review Order</span>
          <Icon name="ArrowRightIcon" size={20} />
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;