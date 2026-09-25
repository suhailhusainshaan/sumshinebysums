import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { resolveCategoryImageSrc } from '@/lib/category-image';
import { HomepageCategory } from '../types';

interface CategoriesSectionProps {
  categories: HomepageCategory[];
}

function isCategoryActive(category: HomepageCategory) {
  return category.active ?? category.isActive ?? true;
}

function getCategoryDisplayOrder(category: HomepageCategory) {
  return category.displayOrder ?? 0;
}

function getCardSpan(index: number, total: number) {
  if (total === 1) {
    return 'lg:col-span-12';
  }

  if (total === 2) {
    return 'sm:col-span-6 lg:col-span-6';
  }

  if (total === 4 && index >= 2) {
    return 'sm:col-span-6 lg:col-span-6';
  }

  if (total >= 5 && index >= 3) {
    return 'sm:col-span-6 lg:col-span-6';
  }

  return 'sm:col-span-6 lg:col-span-4';
}

const CategoriesSection = ({ categories = [] }: CategoriesSectionProps) => {
  const visibleCategories = categories
    .filter(isCategoryActive)
    .sort((left, right) => {
      const leftOrder = getCategoryDisplayOrder(left);
      const rightOrder = getCategoryDisplayOrder(right);

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.id - right.id;
    })
    .slice(0, 5);

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="glass-chip mb-4 inline-flex rounded-full px-4 py-2 text-caption font-medium uppercase tracking-[0.24em] text-primary">
            Shop by style
          </span>
          <h2 className="mb-3 font-heading text-4xl font-semibold text-foreground lg:text-5xl">
            Our Offerings
          </h2>
          <p className="text-lg text-muted-foreground">
            Check out our handmade, homemade, and heart-made designs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/product-listing?category_id=${category.id}`}
              className="group relative block overflow-hidden rounded-[32px] border border-white/45 bg-white/20 p-1 shadow-warm-lg backdrop-blur transition-spring hover:-translate-y-1 hover:shadow-warm-xl"
            >
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-muted">
                <AppImage
                  src={resolveCategoryImageSrc(category.logoUrl)}
                  alt={category.name}
                  fill
                  className="object-cover transition-spring duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-white/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.3),transparent_16rem)]" />

                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white lg:p-5">
                  <div className="flex justify-end">
                    <span className="glass-chip flex h-11 w-11 items-center justify-center rounded-full text-white transition-spring group-hover:translate-x-1">
                      <Icon name="ArrowRightIcon" size={18} />
                    </span>
                  </div>

                  {/*<div className="rounded-[22px] bg-white/18 px-4 py-3 shadow-warm backdrop-blur-xl">*/}
                  <div className="rounded-[22px] bg-white/18 px-4 py-3 shadow-warm">
                    <h3 className="font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
