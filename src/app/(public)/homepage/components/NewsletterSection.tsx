'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const NewsletterSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Icon name="EnvelopeIcon" size={32} className="text-primary" />
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, style tips, and be the first to know about new collections
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <Icon name="EnvelopeIcon" size={32} className="text-primary" />
        </div>

        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Join Our Newsletter
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Subscribe to receive exclusive offers, style tips, and be the first to know about new collections
        </p>

        {isSubmitted ? (
          <div className="max-w-md mx-auto p-6 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-success">
              <Icon name="CheckCircleIcon" size={24} variant="solid" />
              <p className="font-medium">Thank you for subscribing!</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
              />
              <button
                type="submit"
                className="h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-spring whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
            <p className="text-caption text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates
            </p>
          </form>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <Icon name="SparklesIcon" size={32} className="text-primary mb-3" />
            <h3 className="font-medium text-foreground mb-1">Exclusive Offers</h3>
            <p className="text-caption text-muted-foreground text-center">
              Get 15% off your first order
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Icon name="BellIcon" size={32} className="text-primary mb-3" />
            <h3 className="font-medium text-foreground mb-1">Early Access</h3>
            <p className="text-caption text-muted-foreground text-center">
              Shop new collections first
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Icon name="GiftIcon" size={32} className="text-primary mb-3" />
            <h3 className="font-medium text-foreground mb-1">Special Gifts</h3>
            <p className="text-caption text-muted-foreground text-center">
              Birthday surprises & more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;