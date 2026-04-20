'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  alt: string;
  category: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
}

const RelatedProducts = ({ products, title = 'Complete the Look' }: RelatedProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) {
      return;
    }

    const scrollAmount = 300;
    scrollContainerRef.current.scrollTo({
      left:
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount),
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground lg:text-3xl">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="rounded-full bg-muted p-2 transition-luxe hover:bg-primary hover:text-primary-foreground"
            aria-label="Scroll left"
          >
            <Icon name="ChevronLeftIcon" size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="rounded-full bg-muted p-2 transition-luxe hover:bg-primary hover:text-primary-foreground"
            aria-label="Scroll right"
          >
            <Icon name="ChevronRightIcon" size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
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
              className="group w-64 flex-shrink-0 rounded-lg bg-card shadow-warm transition-luxe hover:shadow-warm-md"
            >
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {discount > 0 && (
                  <div className="absolute right-3 top-3 rounded-md bg-error px-2 py-1 text-sm font-medium text-error-foreground">
                    {discount}% OFF
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <p className="text-caption text-muted-foreground">{product.category}</p>
                <h3 className="line-clamp-2 font-medium text-foreground transition-luxe group-hover:text-primary">
                  {product.name}
                </h3>
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
