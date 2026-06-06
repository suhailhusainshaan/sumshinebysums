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
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold text-foreground lg:text-4xl">
            Our Offerings
          </h2>
          <p className="text-lg text-muted-foreground">
            Checkout our Handmade, Homemade and Heart-made Designs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/product-listing?category_id=${category.id}`}
              className="group relative block overflow-hidden rounded-[28px]"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <AppImage
                  src={resolveCategoryImageSrc(category.logoUrl)}
                  alt={category.name}
                  fill
                  className="object-cover transition-spring duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white lg:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-[75%]">
                      {/*<p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">*/}
                      {/*  Category*/}
                      {/*</p>*/}
                      {/*<h3 className="mt-2 font-heading text-3xl font-semibold text-white">*/}
                      {/*  {category.name}*/}
                      {/*</h3>*/}
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-spring group-hover:translate-x-1">
                      <Icon name="ArrowRightIcon" size={18} />
                    </span>
                  </div>

                  {/*<div className="max-w-md">*/}
                  {/*  <p className="line-clamp-2 text-sm leading-6 text-white/80 sm:text-base">*/}
                  {/*    {category.description ||*/}
                  {/*      `Explore handcrafted ${category.name.toLowerCase()} designed for gifting and daily styling.`}*/}
                  {/*  </p>*/}
                  {/*  <span className="mt-4 inline-flex items-center text-sm font-medium text-[#f4c27a]">*/}
                  {/*    Shop collection*/}
                  {/*  </span>*/}
                  {/*</div>*/}
                  <h3 className="mt-2 font-heading text-3xl font-semibold text-white">
                    {category.name}
                  </h3>
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
