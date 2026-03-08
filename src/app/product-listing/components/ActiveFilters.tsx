'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActiveFilter {
  id: string;
  type: 'category' | 'material' | 'color' | 'price';
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemoveFilter: (filterId: string, filterType: string) => void;
  onClearAll: () => void;
}

const ActiveFilters = ({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted rounded-lg">
      <span className="text-sm font-medium text-foreground">Active Filters:</span>
      {filters.map((filter) => (
        <button
          key={`${filter.type}-${filter.id}`}
          onClick={() => onRemoveFilter(filter.id, filter.type)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-sm text-foreground hover:border-primary transition-luxe"
        >
          {filter.label}
          <Icon name="XMarkIcon" size={14} />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-primary hover:text-accent font-medium transition-luxe"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;