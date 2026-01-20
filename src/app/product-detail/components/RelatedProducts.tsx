'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  category: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
}

const RelatedProducts = ({ products, title = 'Complete the Look' }: RelatedProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-luxe"
            aria-label="Scroll left"
          >
            <Icon name="ChevronLeftIcon" size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-luxe"
            aria-label="Scroll right"
          >
            <Icon name="ChevronRightIcon" size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <Link
              key={product.id}
              href={`/product-detail?id=${product.id}`}
              className="flex-shrink-0 w-64 bg-card rounded-lg shadow-warm hover:shadow-warm-md transition-luxe group"
            >
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                  <div className="absolute top-3 right-3 bg-error text-error-foreground px-2 py-1 rounded-md text-sm font-medium">
                    {discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <p className="text-caption text-muted-foreground">{product.category}</p>
                <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-luxe">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <Icon
                      key={index}
                      name="StarIcon"
                      size={14}
                      variant={index < Math.floor(product.rating) ? 'solid' : 'outline'}
                      className={
                        index < Math.floor(product.rating)
                          ? 'text-warning' :'text-muted-foreground'
                      }
                    />
                  ))}
                  <span className="text-caption text-muted-foreground ml-1">
                    ({product.rating})
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-data text-lg font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-data text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;