'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { ProductListingVariant } from '../types';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  images?: string[];
  alt: string;
  category?: string;
  brand?: string;
  isFeatured?: boolean;
  variants: ProductListingVariant[];
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  wishlistItems: string[];
  onQuickAdd: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  isLoading?: boolean;
}

const ProductGrid = ({
  products,
  viewMode,
  wishlistItems,
  onQuickAdd,
  onWishlistToggle,
  isLoading = false,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-2'
        }`}
      >
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse overflow-hidden bg-porcelain border border-mist flex flex-col">
            <div className="aspect-[4/5] bg-mist" />
            <div className="space-y-3 p-5 flex-grow">
              <div className="h-2 w-1/3 bg-mist" />
              <div className="h-4 w-3/4 bg-mist" />
              <div className="h-4 w-1/2 bg-mist mt-auto" />
            </div>
            <div className="px-5 pb-5 mt-auto">
              <div className="h-10 w-full bg-mist" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-mist/50">
          <svg
            className="h-10 w-10 text-ink/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="mb-2 font-display text-2xl tracking-wide text-ink">
          No products found
        </h3>
        <p className="text-ink/60">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-2'
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onQuickAdd={onQuickAdd}
          onWishlistToggle={onWishlistToggle}
          isInWishlist={wishlistItems.includes(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
