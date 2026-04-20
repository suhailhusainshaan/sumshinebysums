'use client';

import React, { useMemo, useState } from 'react';
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
  specifications: Record<string, unknown>;
  features: Record<string, unknown>;
}

const ProductTabs = ({
  description,
  careInstructions,
  reviews,
  shippingInfo,
  specifications,
  features,
}: ProductTabsProps) => {
  const tabs: {
    id: 'description' | 'care' | 'reviews' | 'shipping';
    label: string;
    icon: string;
  }[] = [
    { id: 'description', label: 'Description', icon: 'DocumentTextIcon' },
    { id: 'care', label: 'Details', icon: 'SparklesIcon' },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: 'StarIcon' },
    { id: 'shipping', label: 'Shipping', icon: 'TruckIcon' },
  ];

  const [activeTab, setActiveTab] = useState<'description' | 'care' | 'reviews' | 'shipping'>(
    'description'
  );

  const specEntries = useMemo(
    () =>
      Object.entries({ ...features, ...specifications }).filter(
        ([, value]) =>
          typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
      ),
    [features, specifications]
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border-b border-border">
        <div className="flex min-w-max space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 border-b-2 px-6 py-4 font-medium transition-luxe ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-line leading-relaxed text-foreground">{description}</p>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-6">
            {careInstructions.length > 0 && (
              <div className="space-y-4">
                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                  Care Instructions
                </h3>
                <ul className="space-y-3">
                  {careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Icon
                        name="CheckCircleIcon"
                        size={20}
                        variant="solid"
                        className="mt-1 flex-shrink-0 text-success"
                      />
                      <span className="text-foreground">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {specEntries.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-muted p-4">
                    <p className="mb-1 text-caption uppercase tracking-wide text-muted-foreground">
                      {key}
                    </p>
                    <p className="font-medium text-foreground">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}

            {careInstructions.length === 0 && specEntries.length === 0 && (
              <p className="text-muted-foreground">No additional product details available.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-muted p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center space-x-2">
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
                              ? 'text-warning'
                              : 'text-muted-foreground'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-caption text-muted-foreground">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews available for this product yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="mb-1 flex items-center space-x-2">
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
                    </div>
                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="leading-relaxed text-foreground">{shippingInfo}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-muted p-6">
                <div className="mb-3 flex items-center space-x-3">
                  <Icon name="TruckIcon" size={24} className="text-primary" />
                  <h4 className="font-medium text-foreground">Standard Shipping</h4>
                </div>
                <p className="text-caption text-muted-foreground">
                  Shipping cost and ETA depend on delivery address and checkout selection.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-6">
                <div className="mb-3 flex items-center space-x-3">
                  <Icon name="BoltIcon" size={24} className="text-primary" />
                  <h4 className="font-medium text-foreground">Express Shipping</h4>
                </div>
                <p className="text-caption text-muted-foreground">
                  Faster delivery options may appear during checkout when available.
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
