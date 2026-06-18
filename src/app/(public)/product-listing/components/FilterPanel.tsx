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
  priceRange: PriceRange;
  selectedCategories: string[];
  selectedPriceRange: PriceRange;
  onCategoryToggle: (categoryId: string) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterPanel = ({
  categories,
  priceRange,
  selectedCategories,
  selectedPriceRange,
  onCategoryToggle,
  onPriceRangeChange,
  onClearAll,
  isMobile = false,
  onClose,
}: FilterPanelProps) => {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
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
    <div className={`bg-ivory ${isMobile ? 'h-full overflow-y-auto' : 'border border-mist'}`}>
      <div className="flex items-center justify-between border-b border-mist p-6">
        <h2 className="font-display text-2xl tracking-wide text-ink">Filters</h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs uppercase tracking-widest text-ink/70 hover:text-gold transition-luxe"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Close filters"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 p-6">
        <div>
          <h3 className="mb-5 font-medium tracking-wide text-ink uppercase text-sm">Category</h3>
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
                    className="h-5 w-5 cursor-pointer rounded border-mist text-gold transition-luxe focus:ring-2 focus:ring-gold focus:ring-offset-2"
                  />
                  <span className="text-ink transition-luxe group-hover:text-gold">
                    {category.label}
                  </span>
                </div>
                <span className="text-xs text-ink/50">({category.count})</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-medium tracking-wide text-ink uppercase text-sm">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-xs tracking-widest uppercase text-ink/70">Min</label>
                <input
                  type="number"
                  value={selectedPriceRange.min}
                  onChange={handlePriceMinChange}
                  min={priceRange.min}
                  max={selectedPriceRange.max}
                  className="w-full border border-mist bg-porcelain px-4 py-2 text-ink transition-luxe focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                />
              </div>
              <span className="mt-6 text-ink/50">-</span>
              <div className="flex-1">
                <label className="mb-2 block text-xs tracking-widest uppercase text-ink/70">Max</label>
                <input
                  type="number"
                  value={selectedPriceRange.max}
                  onChange={handlePriceMaxChange}
                  min={selectedPriceRange.min}
                  max={priceRange.max}
                  className="w-full border border-mist bg-porcelain px-4 py-2 text-ink transition-luxe focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs tracking-widest uppercase text-ink/60">
              <span>₹{priceRange.min}</span>
              <span>₹{priceRange.max}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
