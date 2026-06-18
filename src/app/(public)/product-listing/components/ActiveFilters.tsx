'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActiveFilter {
  id: string;
  type: 'category' | 'brand' | 'price';
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemoveFilter: (filterId: string, filterType: string) => void;
  onClearAll: () => void;
}

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 bg-mist/30 p-4 border border-mist">
      <span className="text-xs uppercase tracking-widest font-medium text-ink">Active Filters:</span>
      {filters.map((filter) => (
        <button
          key={`${filter.type}-${filter.id}`}
          onClick={() => onRemoveFilter(filter.id, filter.type)}
          className="inline-flex items-center gap-2 border border-mist bg-ivory px-3 py-1.5 text-xs tracking-wide text-ink transition-luxe hover:border-gold hover:text-gold"
        >
          {filter.label}
          <Icon name="XMarkIcon" size={12} />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs uppercase tracking-widest font-medium text-ink transition-luxe hover:text-gold ml-2"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;
