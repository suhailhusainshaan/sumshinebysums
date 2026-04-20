'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterPanelProps {
  categories: FilterOption[];
  brands: FilterOption[];
  priceRange: PriceRange;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRange: PriceRange;
  onCategoryToggle: (categoryId: string) => void;
  onBrandToggle: (brandId: string) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterPanel = ({
  categories,
  brands,
  priceRange,
  selectedCategories,
  selectedBrands,
  selectedPriceRange,
  onCategoryToggle,
  onBrandToggle,
  onPriceRangeChange,
  onClearAll,
  isMobile = false,
  onClose,
}: FilterPanelProps) => {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPriceRange.min !== priceRange.min ||
    selectedPriceRange.max !== priceRange.max;

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onPriceRangeChange({ ...selectedPriceRange, min: value });
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onPriceRangeChange({ ...selectedPriceRange, max: value });
  };

  return (
    <div className={`bg-card ${isMobile ? 'h-full overflow-y-auto' : 'rounded-lg shadow-warm'}`}>
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Filters</h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-caption text-primary hover:text-accent transition-luxe"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-foreground hover:text-primary transition-luxe"
              aria-label="Close filters"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 p-6">
        <div>
          <h3 className="mb-4 font-medium text-foreground">Category</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="group flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => onCategoryToggle(category.id)}
                    className="h-5 w-5 cursor-pointer rounded border-border text-primary transition-luxe focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <span className="text-foreground transition-luxe group-hover:text-primary">
                    {category.label}
                  </span>
                </div>
                <span className="text-caption text-muted-foreground">({category.count})</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-medium text-foreground">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-caption text-muted-foreground">Min</label>
                <input
                  type="number"
                  value={selectedPriceRange.min}
                  onChange={handlePriceMinChange}
                  min={priceRange.min}
                  max={selectedPriceRange.max}
                  className="w-full rounded-md border border-border bg-input px-4 py-2 text-foreground transition-luxe focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <span className="mt-6 text-muted-foreground">-</span>
              <div className="flex-1">
                <label className="mb-2 block text-caption text-muted-foreground">Max</label>
                <input
                  type="number"
                  value={selectedPriceRange.max}
                  onChange={handlePriceMaxChange}
                  min={selectedPriceRange.min}
                  max={priceRange.max}
                  className="w-full rounded-md border border-border bg-input px-4 py-2 text-foreground transition-luxe focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-caption text-muted-foreground">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-medium text-foreground">Brand</h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="group flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => onBrandToggle(brand.id)}
                    className="h-5 w-5 cursor-pointer rounded border-border text-primary transition-luxe focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <span className="text-foreground transition-luxe group-hover:text-primary">
                    {brand.label}
                  </span>
                </div>
                <span className="text-caption text-muted-foreground">({brand.count})</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
