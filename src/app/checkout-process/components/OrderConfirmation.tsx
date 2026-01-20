'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface OrderConfirmationProps {
  orderNumber: string;
  email: string;
  estimatedDelivery: string;
  onContinueShopping: () => void;
}

const OrderConfirmation = ({
  orderNumber,
  email,
  estimatedDelivery,
  onContinueShopping,
}: OrderConfirmationProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg shadow-warm-lg p-8 text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
          <Icon name="CheckCircleIcon" size={48} className="text-success" />
        </div>

        {/* Success Message */}
        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Details */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-caption text-muted-foreground mb-1">Order Number</p>
                <p className="text-data text-lg font-semibold text-foreground">{orderNumber}</p>
              </div>
              <Link
                href={`/order-tracking?order=${orderNumber}`}
                className="text-primary hover:text-primary/80 transition-luxe flex items-center space-x-1"
              >
                <span className="text-sm font-medium">Track Order</span>
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-caption text-muted-foreground mb-1">Confirmation Email</p>
              <p className="text-foreground">{email}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-caption text-muted-foreground mb-1">Estimated Delivery</p>
              <p className="text-foreground font-medium">{estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Icon name="EnvelopeIcon" size={32} className="mx-auto text-primary mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">Email Sent</p>
            <p className="text-caption text-muted-foreground">
              Check your inbox for order details
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Icon name="TruckIcon" size={32} className="mx-auto text-primary mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">Processing</p>
            <p className="text-caption text-muted-foreground">
              Your order is being prepared
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Icon name="BellIcon" size={32} className="mx-auto text-primary mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">Updates</p>
            <p className="text-caption text-muted-foreground">
              We'll notify you of any changes
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/homepage"
            onClick={onContinueShopping}
            className="flex-1 bg-primary text-primary-foreground py-4 px-6 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe flex items-center justify-center space-x-2"
          >
            <Icon name="ShoppingBagIcon" size={20} />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href={`/order-tracking?order=${orderNumber}`}
            className="flex-1 bg-muted text-foreground py-4 px-6 rounded-md font-medium hover:bg-muted/80 transition-luxe flex items-center justify-center space-x-2"
          >
            <Icon name="MapPinIcon" size={20} />
            <span>Track Order</span>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Need help with your order?
          </p>
          <Link
            href="/contact-support"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-luxe"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} />
            <span className="font-medium">Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;