'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  path: string;
}

interface SearchComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
}

const SearchComponent = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = 'Search for jewelry...',
}: SearchComponentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsLoading(true);
      debounceTimerRef.current = setTimeout(async () => {
        if (onSearch) {
          try {
            const results = await onSearch(searchQuery);
            setSearchResults(results);
          } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, onSearch]);

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  const handleResultClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-search-overlay">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1 relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full h-12 pl-12 pr-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
            />
          </div>
          <button
            onClick={handleClose}
            className="p-3 text-foreground hover:text-primary transition-luxe"
            aria-label="Close search"
          >
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>

        {/* Search Results */}
        <div className="bg-card rounded-md shadow-warm-md max-h-[calc(100vh-200px)] overflow-y-auto">
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Searching...</p>
            </div>
          )}

          {!isLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <div className="p-8 text-center">
              <Icon name="MagnifyingGlassIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium mb-2">No results found</p>
              <p className="text-caption text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="divide-y divide-border">
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.path}
                  onClick={handleResultClick}
                  className="flex items-center space-x-4 p-4 hover:bg-muted transition-luxe"
                >
                  <AppImage
                    src={result.image}
                    alt={result.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {result.name}
                    </h3>
                    <p className="text-caption text-muted-foreground">
                      {result.category}
                    </p>
                    <p className="text-data text-primary font-medium mt-1">
                      ${result.price.toFixed(2)}
                    </p>
                  </div>
                  <Icon name="ChevronRightIcon" size={20} className="text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {searchQuery.trim().length < 2 && (
            <div className="p-8">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Sets', 'New Arrivals'].map(
                  (category) => (
                    <Link
                      key={category}
                      href={`/product-listing?category=${category.toLowerCase()}`}
                      onClick={handleResultClick}
                      className="p-4 bg-muted rounded-md text-center text-foreground hover:bg-primary hover:text-primary-foreground transition-luxe"
                    >
                      {category}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;