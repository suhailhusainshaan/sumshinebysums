import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { HomepageFeaturedProduct } from '../types';

interface FeaturedProductsProps {
  products: HomepageFeaturedProduct[];
}

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

const FeaturedCollections = ({ products = [] }: FeaturedProductsProps) => {
  // console.log('FeaturedCollections rendered with products:', products);
  const isEmpty = products && Array.isArray(products) ? products.length === 0 : true;

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our curated selection of featured jewelry, each designed to complement your
              unique style
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
                key={`featured-product-skeleton-${index}`}
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

          {Array.isArray(products) && products.map((product) => (
            <Link
              key={product.id}
              href={`/product-detail?id=${product.id}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-luxe hover:shadow-warm-lg"
            >
              <div className="relative h-80 overflow-hidden bg-muted">
                <AppImage
                  src={
                    product.thumbnailUrl
                      ? IMG_BASE_URL + product.thumbnailUrl
                      : '/assets/images/no_image.png'
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-spring duration-500 group-hover:scale-110"
                />
                {product.featured && (
                  <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-caption font-medium text-accent-foreground">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="line-clamp-1 font-medium text-foreground">
                    {product.name}
                  </h3>
                  <Icon
                    name="ArrowRightIcon"
                    size={18}
                    className="text-primary transition-spring group-hover:translate-x-1"
                  />
                </div>
                <p className="text-data font-semibold text-primary text-lg">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {isEmpty && (
          <div className="mt-8 text-center text-muted-foreground">
            Featured products will appear here.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollections;
