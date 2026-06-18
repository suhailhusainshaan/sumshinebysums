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
    <section className="bg-ivory py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl lg:text-5xl text-ink tracking-wide">
              Our Offerings
            </h2>
            <p className="mt-4 text-lg text-ink/70 max-w-md">
              Checkout our Handmade, Homemade and Heart-made Designs
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/product-listing?category_id=${category.id}`}
              className="group relative block snap-start shrink-0 min-w-[280px] w-[80vw] sm:w-[320px] aspect-[4/5]"
            >
              <div className="relative w-full h-full bg-mist overflow-hidden catchlight">
                <AppImage
                  src={resolveCategoryImageSrc(category.logoUrl)}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-velvet/80 via-velvet/20 to-transparent pointer-events-none" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="font-display text-2xl lg:text-3xl text-porcelain tracking-wide">
                      {category.name}
                    </h3>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-porcelain/30 bg-porcelain/10 text-porcelain backdrop-blur-sm transition-transform duration-500 group-hover:translate-x-2">
                      <Icon name="ArrowRightIcon" size={18} />
                    </span>
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
