'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductTabsProps {
  description: string;
  careInstructions: string[];
  reviews: Review[];
  shippingInfo: string;
}

const ProductTabs = ({
  description,
  careInstructions,
  reviews,
  shippingInfo,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'care' | 'reviews' | 'shipping'>(
    'description'
  );

  const tabs = [
    { id: 'description' as const, label: 'Description', icon: 'DocumentTextIcon' },
    { id: 'care' as const, label: 'Care Instructions', icon: 'SparklesIcon' },
    { id: 'reviews' as const, label: `Reviews (${reviews.length})`, icon: 'StarIcon' },
    { id: 'shipping' as const, label: 'Shipping', icon: 'TruckIcon' },
  ];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-luxe border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed">{description}</p>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
              Care Instructions
            </h3>
            <ul className="space-y-3">
              {careInstructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Icon
                    name="CheckCircleIcon"
                    size={20}
                    variant="solid"
                    className="text-success flex-shrink-0 mt-1"
                  />
                  <span className="text-foreground">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-data text-4xl font-semibold text-foreground">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Icon
                          key={index}
                          name="StarIcon"
                          size={24}
                          variant={index < Math.floor(averageRating) ? 'solid' : 'outline'}
                          className={
                            index < Math.floor(averageRating)
                              ? 'text-warning' :'text-muted-foreground'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-caption text-muted-foreground">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:scale-102 transition-luxe">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground">{review.author}</span>
                        {review.verified && (
                          <span className="flex items-center space-x-1 text-caption text-success">
                            <Icon name="CheckBadgeIcon" size={16} variant="solid" />
                            <span>Verified Purchase</span>
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Icon
                          key={index}
                          name="StarIcon"
                          size={16}
                          variant={index < review.rating ? 'solid' : 'outline'}
                          className={
                            index < review.rating ? 'text-warning' : 'text-muted-foreground'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed">{shippingInfo}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="TruckIcon" size={24} className="text-primary" />
                  <h4 className="font-medium text-foreground">Standard Shipping</h4>
                </div>
                <p className="text-caption text-muted-foreground">
                  Free on orders over $50 • 5-7 business days
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="BoltIcon" size={24} className="text-primary" />
                  <h4 className="font-medium text-foreground">Express Shipping</h4>
                </div>
                <p className="text-caption text-muted-foreground">
                  $12.99 • 2-3 business days
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;