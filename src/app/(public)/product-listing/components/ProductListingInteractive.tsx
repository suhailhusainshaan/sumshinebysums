'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import SearchComponent from '@/components/common/SearchComponent';
import Breadcrumb from '@/components/common/Breadcrumb';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import ProductGrid from './ProductGrid';
import QuickAddModal from './QuickAddModal';
import ActiveFilters from './ActiveFilters';
import {
  ProductFilterOption,
  ProductFiltersResponse,
  ProductListingItem,
  ProductListingQuery,
  ProductListingResponse,
} from '../types';

interface PriceRange {
  min: number;
  max: number;
}

interface ActiveFilter {
  id: string;
  type: 'category' | 'price';
  label: string;
}

interface ProductListingInteractiveProps {
  filters: ProductFiltersResponse;
  products: ProductListingResponse;
  query: ProductListingQuery;
  errorMessage: string | null;
}

import { resolveImageSrc } from '@/lib/image';

const toNumberOrFallback = (value: string | null, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const ProductListingInteractive = ({
  filters,
  products,
  query,
  errorMessage,
}: ProductListingInteractiveProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
    alt: string;
    category?: string;
    variants: {
      id: string;
      name: string;
      price: number;
      stockQuantity: number;
    }[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const priceRange: PriceRange = filters.priceRange;
  const selectedPriceRange: PriceRange = {
    min: toNumberOrFallback(query.minPrice, filters.priceRange.min),
    max: toNumberOrFallback(query.maxPrice, filters.priceRange.max),
  };
  const selectedSort = query.sort;
  const selectedCategories = query.categoryId ? [query.categoryId] : [];

  const categories = filters.categories.map((category: ProductFilterOption) => ({
    id: String(category.id),
    label: category.name,
    count: category.count,
  }));

  const listingProducts = useMemo(
    () =>
      products.content.map((product: ProductListingItem) => ({
        id: String(product.id),
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.comparePrice,
        image: product.thumbnail
          ? resolveImageSrc(product.thumbnail)
          : '/assets/images/no_image.png',
        alt: product.images?.[0]?.altText || product.name,
        category: product.category?.name,
        brand: product.brand?.name,
        isFeatured: product.isFeatured,
        variants: product.variants,
        images:
          product.images?.length > 0
            ? product.images.map((img: any) => ({ url: resolveImageSrc(img.url), variantId: img.variantId as number }))
            : product.thumbnail
              ? [{ url: resolveImageSrc(product.thumbnail), variantId: product.variants?.[0]?.id as number }]
              : [{ url: '/assets/images/no_image.png', variantId: product.variants?.[0]?.id as number }],
      })),
    [products.content]
  );

  const sortOptions = [
    { id: 'price_desc', label: 'By Price (Highest/Lowest)' },
    { id: 'price_asc', label: 'By Price (Lowest/Highest)' },
    { id: 'rating_desc', label: 'By Rating (High/Low)' },
    { id: 'rating_asc', label: 'By Rating (Low/High)' },
    { id: 'latest', label: 'By New Products' },
  ];

  const updateQuery = (updates: Partial<ProductListingQuery>) => {
    const nextQuery: ProductListingQuery = {
      ...query,
      ...updates,
    };
    const params = new URLSearchParams();

    params.set('page', String(nextQuery.page));
    params.set('limit', String(nextQuery.limit));
    params.set('sort', nextQuery.sort);

    if (nextQuery.categoryId) {
      params.set('category_id', nextQuery.categoryId);
    }

    if (nextQuery.minPrice) {
      params.set('min_price', nextQuery.minPrice);
    }

    if (nextQuery.maxPrice) {
      params.set('max_price', nextQuery.maxPrice);
    }

    if (nextQuery.q) {
      params.set('q', nextQuery.q);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    updateQuery({
      page: 1,
      minPrice: range.min === priceRange.min ? null : String(range.min),
      maxPrice: range.max === priceRange.max ? null : String(range.max),
    });
  };

  const getActiveFilters = (): ActiveFilter[] => {
    const activeFilters: ActiveFilter[] = [];

    selectedCategories.forEach((id) => {
      const category = categories.find((item) => item.id === id);
      if (category) {
        activeFilters.push({ id, type: 'category', label: category.label });
      }
    });

    if (selectedPriceRange.min !== priceRange.min || selectedPriceRange.max !== priceRange.max) {
      activeFilters.push({
        id: 'price',
        type: 'price',
        label: `₹${selectedPriceRange.min} - ₹${selectedPriceRange.max}`,
      });
    }

    return activeFilters;
  };

  const handleCategoryToggle = (categoryId: string) => {
    updateQuery({
      categoryId: query.categoryId === categoryId ? null : categoryId,
      page: 1,
    });
  };

  const handleClearAllFilters = () => {
    updateQuery({
      page: 1,
      categoryId: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  const handleRemoveFilter = (filterId: string, filterType: string) => {
    switch (filterType) {
      case 'category':
        updateQuery({ categoryId: null, page: 1 });
        break;
      case 'price':
        updateQuery({ minPrice: null, maxPrice: null, page: 1 });
        break;
      default:
        break;
    }
  };

  const handleQuickAdd = (productId: string) => {
    const product = listingProducts.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    setQuickAddProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      alt: product.alt,
      category: product.category,
      variants: product.variants.map((variant) => ({
        id: String(variant.id),
        name: variant.name || variant.sku,
        price: variant.price,
        stockQuantity: variant.stockQuantity ?? 0,
      })),
    });
  };

  const handleAddToCart = (_productId: string, _variantId?: string, _quantity?: number) => {
    // Cart state is managed globally via cartStore; add-to-cart is handled on product-detail page
  };

  const handleWishlistToggle = (productId: string) => {
    setWishlistItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const activeFilters = getActiveFilters();
  const breadcrumbItems = [{ label: 'Shop', path: '/product-listing' }, { label: 'All Products' }];

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => {}}
      />

      <SearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="pb-16 pt-20 lg:pt-22">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <div className="mb-8 flex items-center justify-center relative">
            <h1 className="font-heading text-3xl font-bold text-foreground lg:text-4xl text-center">
              All Products
            </h1>
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="absolute right-0 flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-luxe hover:scale-102 lg:hidden"
            >
              <Icon name="AdjustmentsHorizontalIcon" size={20} />
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            <aside className="hidden w-80 flex-shrink-0 lg:block">
              <div className="sticky top-24">
                <FilterPanel
                  categories={categories}
                  priceRange={priceRange}
                  selectedCategories={selectedCategories}
                  selectedPriceRange={selectedPriceRange}
                  onCategoryToggle={handleCategoryToggle}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              {errorMessage && (
                <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                  {errorMessage}
                </div>
              )}

              <ActiveFilters
                filters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />

              <SortControls
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={(sortId) =>
                  updateQuery({ sort: sortId as ProductListingQuery['sort'], page: 1 })
                }
                resultCount={products.totalElements}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <ProductGrid
                products={listingProducts}
                viewMode={viewMode}
                wishlistItems={wishlistItems}
                onQuickAdd={handleQuickAdd}
                onWishlistToggle={handleWishlistToggle}
                isLoading={isPending}
              />

              {products.totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 rounded-lg bg-card p-4 shadow-warm">
                  <button
                    type="button"
                    onClick={() => updateQuery({ page: Math.max(query.page - 1, 1) })}
                    disabled={products.first || isPending}
                    className="rounded-md border border-border px-4 py-2 text-foreground transition-luxe hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    Page <span className="font-medium text-foreground">{query.page}</span> of{' '}
                    <span className="font-medium text-foreground">{products.totalPages}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuery({ page: Math.min(query.page + 1, products.totalPages) })
                    }
                    disabled={products.last || isPending}
                    className="rounded-md border border-border px-4 py-2 text-foreground transition-luxe hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isFilterPanelOpen && (
        <>
          <div
            className="fixed inset-0 z-mobile-menu bg-background"
            onClick={() => setIsFilterPanelOpen(false)}
          />
          <div className="fixed bottom-0 right-0 top-0 z-mobile-menu w-80 max-w-[85vw]">
            <FilterPanel
              categories={categories}
              priceRange={priceRange}
              selectedCategories={selectedCategories}
              selectedPriceRange={selectedPriceRange}
              onCategoryToggle={handleCategoryToggle}
              onPriceRangeChange={handlePriceRangeChange}
              onClearAll={handleClearAllFilters}
              isMobile={true}
              onClose={() => setIsFilterPanelOpen(false)}
            />
          </div>
        </>
      )}

      <QuickAddModal
        key={quickAddProduct?.id ?? 'quick-add-empty'}
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        product={quickAddProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductListingInteractive;
