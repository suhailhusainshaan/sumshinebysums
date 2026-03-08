'use client';

import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
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
      <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-2'
      }`}>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-card rounded-lg overflow-hidden shadow-warm animate-pulse"
          >
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' ?'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-2'
    }`}>
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