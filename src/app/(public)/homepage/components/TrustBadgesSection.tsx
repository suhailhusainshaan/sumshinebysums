import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

const TrustBadgesSection = () => {
  const badges: TrustBadge[] = [
    {
      icon: 'ShieldCheckIcon',
      title: 'Secure Payments',
      description: 'SSL encrypted checkout for your safety',
    },
    {
      icon: 'TruckIcon',
      title: 'Free Shipping',
      description: 'On orders over $75 nationwide',
    },
    {
      icon: 'ArrowPathIcon',
      title: 'Easy Returns',
      description: '30-day hassle-free return policy',
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      title: '24/7 Support',
      description: 'Expert assistance whenever you need',
    },
  ];

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <Icon name={badge.icon as any} size={24} className="text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">{badge.title}</h3>
              <p className="text-caption text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;