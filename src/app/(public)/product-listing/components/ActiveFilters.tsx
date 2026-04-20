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
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted p-4">
      <span className="text-sm font-medium text-foreground">Active Filters:</span>
      {filters.map((filter) => (
        <button
          key={`${filter.type}-${filter.id}`}
          onClick={() => onRemoveFilter(filter.id, filter.type)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-luxe hover:border-primary"
        >
          {filter.label}
          <Icon name="XMarkIcon" size={14} />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm font-medium text-primary transition-luxe hover:text-accent"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;
