import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
}

interface EmptyCartProps {
  recommendedProducts: RecommendedProduct[];
}

const EmptyCart = ({ recommendedProducts }: EmptyCartProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      {/* Empty State Icon */}
      <div className="mb-6">
        <Icon name="ShoppingBagIcon" size={80} className="mx-auto text-muted-foreground opacity-50" />
      </div>

      {/* Empty State Message */}
      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-3">
        Your Cart is Empty
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping to discover our beautiful jewelry collection.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link
          href="/product-listing"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe"
        >
          <Icon name="SparklesIcon" size={20} />
          Browse Collection
        </Link>
        <Link
          href="/homepage"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-secondary text-secondary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe"
        >
          <Icon name="HomeIcon" size={20} />
          Back to Home
        </Link>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
            You Might Like These
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product-detail?id=${product.id}`}
                className="group bg-card border border-border rounded-md overflow-hidden hover:shadow-warm-md transition-luxe"
              >
                <div className="aspect-square overflow-hidden">
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-luxe"
                  />
                </div>
                <div className="p-3">
                  <p className="text-caption text-muted-foreground mb-1">
                    {product.category}
                  </p>
                  <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h4>
                  <p className="text-data font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyCart;