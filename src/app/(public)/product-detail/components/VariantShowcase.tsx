'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ProductDetailVariant } from '../types';

interface VariantShowcaseProps {
  productId: number;
  variants: ProductDetailVariant[];
  selectedVariantId: number | null;
}

const VariantShowcase = ({ productId, variants, selectedVariantId }: VariantShowcaseProps) => {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground lg:text-3xl">
          All Variants
        </h2>
        <p className="mt-2 text-muted-foreground">
          Each variant keeps its own images and pricing. Select one to update gallery and details.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const image =
            variant.thumbnail || variant.images[0]?.url || '/assets/images/no_image.png';

          return (
            <Link
              key={variant.id}
              href={`/product-detail?id=${productId}&variant=${variant.id}`}
              className={`overflow-hidden rounded-lg border bg-card transition-luxe hover:border-primary hover:shadow-warm ${isSelected ? 'border-primary shadow-warm' : 'border-border'
                }`}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <AppImage
                  src={image}
                  alt={variant.name || variant.sku}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <div>
                  <p className="line-clamp-1 text-sm font-medium text-foreground">
                    {variant.name || variant.sku}
                  </p>
                  <p className="text-caption text-muted-foreground">{variant.sku}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-data text-base font-semibold text-primary">
                    ${variant.price.toFixed(2)}
                  </span>
                  {variant.comparePrice && (
                    <span className="text-caption text-muted-foreground line-through">
                      ${variant.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={
                      (variant.stockQuantity ?? 0) > 0
                        ? 'text-caption text-success'
                        : 'text-caption text-error'
                    }
                  >
                    {(variant.stockQuantity ?? 0) > 0 ? 'In stock' : 'Out of stock'}
                  </span>
                  {isSelected && (
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                      Viewing
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default VariantShowcase;
