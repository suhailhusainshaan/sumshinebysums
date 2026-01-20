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
  materials: FilterOption[];
  colors: FilterOption[];
  priceRange: PriceRange;
  selectedCategories: string[];
  selectedMaterials: string[];
  selectedColors: string[];
  selectedPriceRange: PriceRange;
  onCategoryToggle: (categoryId: string) => void;
  onMaterialToggle: (materialId: string) => void;
  onColorToggle: (colorId: string) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterPanel = ({
  categories,
  materials,
  colors,
  priceRange,
  selectedCategories,
  selectedMaterials,
  selectedColors,
  selectedPriceRange,
  onCategoryToggle,
  onMaterialToggle,
  onColorToggle,
  onPriceRangeChange,
  onClearAll,
  isMobile = false,
  onClose,
}: FilterPanelProps) => {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedColors.length > 0 ||
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
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
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

      {/* Filter Sections */}
      <div className="p-6 space-y-8">
        {/* Categories */}
        <div>
          <h3 className="font-medium text-foreground mb-4">Category</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => onCategoryToggle(category.id)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe cursor-pointer"
                  />
                  <span className="text-foreground group-hover:text-primary transition-luxe">
                    {category.label}
                  </span>
                </div>
                <span className="text-caption text-muted-foreground">
                  ({category.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium text-foreground mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-caption text-muted-foreground mb-2 block">Min</label>
                <input
                  type="number"
                  value={selectedPriceRange.min}
                  onChange={handlePriceMinChange}
                  min={priceRange.min}
                  max={selectedPriceRange.max}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
                />
              </div>
              <span className="text-muted-foreground mt-6">-</span>
              <div className="flex-1">
                <label className="text-caption text-muted-foreground mb-2 block">Max</label>
                <input
                  type="number"
                  value={selectedPriceRange.max}
                  onChange={handlePriceMaxChange}
                  min={selectedPriceRange.min}
                  max={priceRange.max}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-caption text-muted-foreground">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div>
          <h3 className="font-medium text-foreground mb-4">Material</h3>
          <div className="space-y-3">
            {materials.map((material) => (
              <label
                key={material.id}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material.id)}
                    onChange={() => onMaterialToggle(material.id)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe cursor-pointer"
                  />
                  <span className="text-foreground group-hover:text-primary transition-luxe">
                    {material.label}
                  </span>
                </div>
                <span className="text-caption text-muted-foreground">
                  ({material.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="font-medium text-foreground mb-4">Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => onColorToggle(color.id)}
                className={`px-4 py-2 rounded-full border-2 transition-luxe ${
                  selectedColors.includes(color.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary'
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;