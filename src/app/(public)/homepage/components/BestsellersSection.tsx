'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { ProductListingItem } from '@/app/(public)/product-listing/types';

interface BestsellersSectionProps {
  products: ProductListingItem[];
}

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

const BestsellersSection = ({ products = [] }: BestsellersSectionProps) => {
  const isEmpty = products.length === 0;

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Bestsellers
            </h2>
            <p className="text-lg text-muted-foreground">
              Our most loved pieces, chosen by customers like you
            </p>
          </div>
          <Link
            href="/product-listing"
            className="hidden items-center space-x-2 font-medium text-primary transition-luxe hover:text-accent sm:flex"
          >
            <span>View All</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isEmpty &&
            [...Array(4)].map((_, index) => (
              <div
                key={`bestseller-skeleton-${index}`}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="h-80 animate-pulse bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}

          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product-detail?id=${product.id}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-luxe hover:shadow-warm-lg"
            >
              <div className="relative h-80 overflow-hidden bg-muted">
                <AppImage
                  src={
                    product.thumbnail
                      ? `${IMG_BASE_URL}${product.thumbnail}`
                      : '/assets/images/no_image.png'
                  }
                  alt={product.images[0]?.altText || product.name}
                  fill
                  className="object-cover transition-spring duration-500 group-hover:scale-110"
                />
                {product.isFeatured && (
                  <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-caption font-medium text-accent-foreground">
                    Bestseller
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="mb-1 text-caption text-muted-foreground">
                  {product.category?.name || 'Product'}
                </p>
                <h3 className="mb-2 line-clamp-1 font-medium text-foreground">{product.name}</h3>

                <div className="flex items-center space-x-2">
                  <span className="text-data text-lg font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-data text-sm text-muted-foreground line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {isEmpty && (
          <div className="mt-8 text-center text-muted-foreground">
            Bestselling products will appear here after published products are available.
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/product-listing"
            className="inline-flex items-center space-x-2 font-medium text-primary transition-luxe hover:text-accent"
          >
            <span>View All Products</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
