'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortOption {
  id: string;
  label: string;
}

interface SortControlsProps {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  resultCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SortControls = ({
  sortOptions,
  selectedSort,
  onSortChange,
  resultCount,
  viewMode,
  onViewModeChange,
}: SortControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-mist mb-6">
      {/* Result Count */}
      <p className="text-ink/70">
        <span className="font-medium text-ink">{resultCount}</span> products found
      </p>

      {/* Controls */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <label htmlFor="sort" className="text-ink text-sm tracking-wide uppercase whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 sm:flex-initial px-4 py-2 bg-porcelain border border-mist text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 transition-luxe cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center border border-mist overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 transition-luxe ${
              viewMode === 'grid'
                ? 'bg-velvet text-porcelain'
                : 'bg-ivory text-ink/70 hover:bg-mist/30 hover:text-ink'
            }`}
            aria-label="Grid view"
          >
            <Icon name="Squares2X2Icon" size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 transition-luxe ${
              viewMode === 'list'
                ? 'bg-velvet text-porcelain'
                : 'bg-ivory text-ink/70 hover:bg-mist/30 hover:text-ink'
            }`}
            aria-label="List view"
          >
            <Icon name="ListBulletIcon" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortControls;
