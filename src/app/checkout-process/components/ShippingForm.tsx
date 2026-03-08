'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface ShippingFormProps {
  onNext: (data: ShippingFormData) => void;
  initialData?: Partial<ShippingFormData>;
}

const ShippingForm = ({ onNext, initialData }: ShippingFormProps) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    apartment: initialData?.apartment || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'United States',
    deliveryOption: initialData?.deliveryOption || 'standard',
    giftWrapping: initialData?.giftWrapping || false,
    giftMessage: initialData?.giftMessage || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      price: 5.99,
      duration: '5-7 business days',
      icon: 'TruckIcon',
    },
    {
      id: 'express',
      name: 'Express Delivery',
      price: 12.99,
      duration: '2-3 business days',
      icon: 'BoltIcon',
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      price: 24.99,
      duration: 'Next business day',
      icon: 'RocketLaunchIcon',
    },
  ];

  const handleInputChange = (field: keyof ShippingFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code';
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
      {/* Contact Information */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="UserIcon" size={20} className="mr-2 text-primary" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.firstName ? 'border-error' : 'border-border'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-error">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.lastName ? 'border-error' : 'border-border'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-error">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.phone ? 'border-error' : 'border-border'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="MapPinIcon" size={20} className="mr-2 text-primary" />
          Shipping Address
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                errors.address ? 'border-error' : 'border-border'
              }`}
              placeholder="123 Main Street"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-error">{errors.address}</p>
            )}
          </div>
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-foreground mb-1">
              Apartment, Suite, etc. (Optional)
            </label>
            <input
              type="text"
              id="apartment"
              value={formData.apartment}
              onChange={(e) => handleInputChange('apartment', e.target.value)}
              className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
              placeholder="Apt 4B"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                  errors.city ? 'border-error' : 'border-border'
                }`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-error">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1">
                State *
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                  errors.state ? 'border-error' : 'border-border'
                }`}
                placeholder="NY"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-error">{errors.state}</p>
              )}
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={`w-full h-12 px-4 bg-input border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
                  errors.zipCode ? 'border-error' : 'border-border'
                }`}
                placeholder="10001"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-error">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TruckIcon" size={20} className="mr-2 text-primary" />
          Delivery Options
        </h3>
        <div className="space-y-3">
          {deliveryOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-luxe ${
                formData.deliveryOption === option.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="deliveryOption"
                  value={option.id}
                  checked={formData.deliveryOption === option.id}
                  onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-ring"
                />
                <Icon name={option.icon as any} size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">{option.name}</p>
                  <p className="text-caption text-muted-foreground">{option.duration}</p>
                </div>
              </div>
              <span className="text-data font-semibold text-primary">
                ${option.price.toFixed(2)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Gift Options */}
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="GiftIcon" size={20} className="mr-2 text-primary" />
          Gift Options
        </h3>
        <label className="flex items-center space-x-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.giftWrapping}
            onChange={(e) => handleInputChange('giftWrapping', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-ring"
          />
          <span className="text-foreground">
            Add gift wrapping <span className="text-primary font-medium">(+$4.99)</span>
          </span>
        </label>
        {formData.giftWrapping && (
          <div>
            <label htmlFor="giftMessage" className="block text-sm font-medium text-foreground mb-1">
              Gift Message (Optional)
            </label>
            <textarea
              id="giftMessage"
              value={formData.giftMessage}
              onChange={(e) => handleInputChange('giftMessage', e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe resize-none"
              placeholder="Add a personal message for the recipient..."
            />
            <p className="mt-1 text-caption text-muted-foreground text-right">
              {formData.giftMessage.length}/200
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center space-x-2"
      >
        <span>Continue to Payment</span>
        <Icon name="ArrowRightIcon" size={20} />
      </button>
    </form>
  );
};

export default ShippingForm;