'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import MobileHamburgerMenu from '@/components/common/MobileHamburgerMenu';
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
  type: 'category' | 'brand' | 'price';
  label: string;
}

interface ProductListingInteractiveProps {
  filters: ProductFiltersResponse;
  products: ProductListingResponse;
  query: ProductListingQuery;
  errorMessage: string | null;
}

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [cartItemCount, setCartItemCount] = useState(3);
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
  const selectedBrands = query.brandId ? [query.brandId] : [];

  const categories = filters.categories.map((category: ProductFilterOption) => ({
    id: String(category.id),
    label: category.name,
    count: category.count,
  }));

  const brands = filters.brands.map((brand: ProductFilterOption) => ({
    id: String(brand.id),
    label: brand.name,
    count: brand.count,
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
          ? `${IMG_BASE_URL}${product.thumbnail}`
          : '/assets/images/no_image.png',
        alt: product.images[0]?.altText || product.name,
        category: product.category?.name,
        brand: product.brand?.name,
        isFeatured: product.isFeatured,
        variants: product.variants,
      })),
    [products.content]
  );

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
    { id: 'latest', label: 'Newest First' },
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

    if (nextQuery.brandId) {
      params.set('brand_id', nextQuery.brandId);
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

    selectedBrands.forEach((id) => {
      const brand = brands.find((item) => item.id === id);
      if (brand) {
        activeFilters.push({ id, type: 'brand', label: brand.label });
      }
    });

    if (selectedPriceRange.min !== priceRange.min || selectedPriceRange.max !== priceRange.max) {
      activeFilters.push({
        id: 'price',
        type: 'price',
        label: `$${selectedPriceRange.min} - $${selectedPriceRange.max}`,
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

  const handleBrandToggle = (brandId: string) => {
    updateQuery({
      brandId: query.brandId === brandId ? null : brandId,
      page: 1,
    });
  };

  const handleClearAllFilters = () => {
    updateQuery({
      page: 1,
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  const handleRemoveFilter = (filterId: string, filterType: string) => {
    switch (filterType) {
      case 'category':
        updateQuery({ categoryId: null, page: 1 });
        break;
      case 'brand':
        updateQuery({ brandId: null, page: 1 });
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

  const handleAddToCart = (productId: string, variantId?: string, quantity?: number) => {
    setCartItemCount((prev) => prev + (quantity || 1));
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
        cartItemCount={cartItemCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => {}}
      />

      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartItemCount={cartItemCount}
      />

      <SearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="pb-16 pt-20 lg:pt-22">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              All Products
            </h1>
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-luxe hover:scale-102 lg:hidden"
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
                  brands={brands}
                  priceRange={priceRange}
                  selectedCategories={selectedCategories}
                  selectedBrands={selectedBrands}
                  selectedPriceRange={selectedPriceRange}
                  onCategoryToggle={handleCategoryToggle}
                  onBrandToggle={handleBrandToggle}
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
              brands={brands}
              priceRange={priceRange}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedPriceRange={selectedPriceRange}
              onCategoryToggle={handleCategoryToggle}
              onBrandToggle={handleBrandToggle}
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
