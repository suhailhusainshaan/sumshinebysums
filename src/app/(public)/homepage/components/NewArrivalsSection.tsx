import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { ProductListingItem } from '@/app/(public)/product-listing/types';

interface NewArrivalsSectionProps {
  products: ProductListingItem[];
}

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

const NewArrivalsSection = ({ products = [] }: NewArrivalsSectionProps) => {
  const isEmpty = products.length === 0;

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
            <p className="text-caption font-medium text-accent">Just Arrived</p>
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
            New Arrivals
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Be the first to discover our latest jewelry designs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isEmpty &&
            [...Array(4)].map((_, index) => (
              <div
                key={`new-arrival-skeleton-${index}`}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="h-80 animate-pulse bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}

          {products.map((item) => (
            <Link
              key={item.id}
              href={`/product-detail?id=${item.id}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-luxe hover:shadow-warm-lg"
            >
              <div className="relative h-80 overflow-hidden bg-muted">
                <AppImage
                  src={
                    item.thumbnail
                      ? `${IMG_BASE_URL}${item.thumbnail}`
                      : '/assets/images/no_image.png'
                  }
                  alt={item.images[0]?.altText || item.name}
                  fill
                  className="object-cover transition-spring duration-500 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4 rounded-full bg-success px-3 py-1 text-caption font-medium text-success-foreground">
                  New
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-2 line-clamp-1 font-medium text-foreground">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-data text-lg font-semibold text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                  <Icon
                    name="ArrowRightIcon"
                    size={20}
                    className="text-muted-foreground transition-spring group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {isEmpty && (
          <div className="mt-8 text-center text-muted-foreground">
            New arrivals will show here when recent published products are added.
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/product-listing?sort=latest"
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-8 py-4 font-medium text-primary-foreground transition-spring hover:scale-102 hover:shadow-warm-md"
          >
            <span>Explore All New Arrivals</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
