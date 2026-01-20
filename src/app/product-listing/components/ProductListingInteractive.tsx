'use client';

import React, { useState, useEffect } from 'react';
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

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  material: string;
  color: string;
  isNew?: boolean;
  requiresSize: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface ActiveFilter {
  id: string;
  type: 'category' | 'material' | 'color' | 'price';
  label: string;
}

const ProductListingInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({ min: 0, max: 500 });
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [cartItemCount, setCartItemCount] = useState(3);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Elegant Rose Gold Necklace with Crystal Pendant',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      alt: 'Elegant rose gold necklace with teardrop crystal pendant on white display stand',
      rating: 4.8,
      reviewCount: 124,
      category: 'Necklaces',
      material: 'Rose Gold Plated',
      color: 'Rose Gold',
      isNew: true,
      requiresSize: false,
    },
    {
      id: '2',
      name: 'Classic Pearl Drop Earrings',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
      alt: 'Classic white pearl drop earrings with gold hooks on marble surface',
      rating: 4.6,
      reviewCount: 89,
      category: 'Earrings',
      material: 'Gold Plated',
      color: 'Gold',
      requiresSize: false,
    },
    {
      id: '3',
      name: 'Delicate Chain Bracelet with Heart Charm',
      price: 34.99,
      originalPrice: 49.99,
      image: 'https://images.pixabay.com/photo/2017/08/01/11/48/jewelry-2564394_1280.jpg',
      alt: 'Delicate silver chain bracelet with heart charm on velvet cushion',
      rating: 4.7,
      reviewCount: 156,
      category: 'Bracelets',
      material: 'Silver Plated',
      color: 'Silver',
      requiresSize: true,
    },
    {
      id: '4',
      name: 'Statement Cocktail Ring with Emerald Stone',
      price: 67.99,
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      alt: 'Statement cocktail ring with large emerald green stone in gold setting',
      rating: 4.9,
      reviewCount: 203,
      category: 'Rings',
      material: 'Gold Plated',
      color: 'Gold',
      isNew: true,
      requiresSize: true,
    },
    {
      id: '5',
      name: 'Vintage-Inspired Chandelier Earrings',
      price: 56.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
      alt: 'Vintage-inspired chandelier earrings with crystal drops on black display',
      rating: 4.5,
      reviewCount: 78,
      category: 'Earrings',
      material: 'Silver Plated',
      color: 'Silver',
      requiresSize: false,
    },
    {
      id: '6',
      name: 'Layered Gold Chain Necklace Set',
      price: 78.99,
      image: 'https://images.pixabay.com/photo/2020/05/11/22/31/chain-5160327_1280.jpg',
      alt: 'Layered gold chain necklace set with three different lengths on white background',
      rating: 4.8,
      reviewCount: 167,
      category: 'Necklaces',
      material: 'Gold Plated',
      color: 'Gold',
      requiresSize: false,
    },
    {
      id: '7',
      name: 'Minimalist Stud Earrings Set',
      price: 29.99,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
      alt: 'Minimalist stud earrings set with geometric shapes in rose gold',
      rating: 4.4,
      reviewCount: 92,
      category: 'Earrings',
      material: 'Rose Gold Plated',
      color: 'Rose Gold',
      isNew: true,
      requiresSize: false,
    },
    {
      id: '8',
      name: 'Bohemian Beaded Bracelet Stack',
      price: 42.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
      alt: 'Bohemian beaded bracelet stack with colorful stones and gold accents',
      rating: 4.6,
      reviewCount: 134,
      category: 'Bracelets',
      material: 'Mixed Metals',
      color: 'Multi',
      requiresSize: true,
    },
  ];

  const categories: FilterOption[] = [
    { id: 'necklaces', label: 'Necklaces', count: 2 },
    { id: 'earrings', label: 'Earrings', count: 3 },
    { id: 'bracelets', label: 'Bracelets', count: 2 },
    { id: 'rings', label: 'Rings', count: 1 },
  ];

  const materials: FilterOption[] = [
    { id: 'gold', label: 'Gold Plated', count: 3 },
    { id: 'silver', label: 'Silver Plated', count: 2 },
    { id: 'rose-gold', label: 'Rose Gold Plated', count: 2 },
    { id: 'mixed', label: 'Mixed Metals', count: 1 },
  ];

  const colors: FilterOption[] = [
    { id: 'gold', label: 'Gold', count: 3 },
    { id: 'silver', label: 'Silver', count: 2 },
    { id: 'rose-gold', label: 'Rose Gold', count: 2 },
    { id: 'multi', label: 'Multi', count: 1 },
  ];

  const sortOptions = [
    { id: 'popularity', label: 'Most Popular' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest First' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  const priceRange: PriceRange = { min: 0, max: 500 };

  const getFilteredProducts = () => {
    let filtered = [...mockProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category.toLowerCase())
      );
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((p) =>
        selectedMaterials.some((m) => p.material.toLowerCase().includes(m))
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        selectedColors.includes(p.color.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    );

    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  };

  const getActiveFilters = (): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];

    selectedCategories.forEach((id) => {
      const cat = categories.find((c) => c.id === id);
      if (cat) filters.push({ id, type: 'category', label: cat.label });
    });

    selectedMaterials.forEach((id) => {
      const mat = materials.find((m) => m.id === id);
      if (mat) filters.push({ id, type: 'material', label: mat.label });
    });

    selectedColors.forEach((id) => {
      const col = colors.find((c) => c.id === id);
      if (col) filters.push({ id, type: 'color', label: col.label });
    });

    if (selectedPriceRange.min !== priceRange.min || selectedPriceRange.max !== priceRange.max) {
      filters.push({
        id: 'price',
        type: 'price',
        label: `$${selectedPriceRange.min} - $${selectedPriceRange.max}`,
      });
    }

    return filters;
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleColorToggle = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedPriceRange(priceRange);
  };

  const handleRemoveFilter = (filterId: string, filterType: string) => {
    switch (filterType) {
      case 'category':
        setSelectedCategories((prev) => prev.filter((id) => id !== filterId));
        break;
      case 'material':
        setSelectedMaterials((prev) => prev.filter((id) => id !== filterId));
        break;
      case 'color':
        setSelectedColors((prev) => prev.filter((id) => id !== filterId));
        break;
      case 'price':
        setSelectedPriceRange(priceRange);
        break;
    }
  };

  const handleQuickAdd = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setQuickAddProduct(product);
    }
  };

  const handleAddToCart = (productId: string, size?: string, quantity?: number) => {
    setCartItemCount((prev) => prev + (quantity || 1));
  };

  const handleWishlistToggle = (productId: string) => {
    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = getFilteredProducts();
  const activeFilters = getActiveFilters();

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'All Products' },
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 lg:h-18 bg-card shadow-warm" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-12 bg-muted rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main className="pt-20 lg:pt-22 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
              All Products
            </h1>
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 transition-luxe"
            >
              <Icon name="AdjustmentsHorizontalIcon" size={20} />
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel
                  categories={categories}
                  materials={materials}
                  colors={colors}
                  priceRange={priceRange}
                  selectedCategories={selectedCategories}
                  selectedMaterials={selectedMaterials}
                  selectedColors={selectedColors}
                  selectedPriceRange={selectedPriceRange}
                  onCategoryToggle={handleCategoryToggle}
                  onMaterialToggle={handleMaterialToggle}
                  onColorToggle={handleColorToggle}
                  onPriceRangeChange={setSelectedPriceRange}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <ActiveFilters
                filters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />

              <SortControls
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                resultCount={filteredProducts.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <ProductGrid
                products={filteredProducts}
                viewMode={viewMode}
                wishlistItems={wishlistItems}
                onQuickAdd={handleQuickAdd}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
          </div>
        </div>
      </main>

      {isFilterPanelOpen && (
        <>
          <div
            className="fixed inset-0 bg-background z-mobile-menu"
            onClick={() => setIsFilterPanelOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-mobile-menu">
            <FilterPanel
              categories={categories}
              materials={materials}
              colors={colors}
              priceRange={priceRange}
              selectedCategories={selectedCategories}
              selectedMaterials={selectedMaterials}
              selectedColors={selectedColors}
              selectedPriceRange={selectedPriceRange}
              onCategoryToggle={handleCategoryToggle}
              onMaterialToggle={handleMaterialToggle}
              onColorToggle={handleColorToggle}
              onPriceRangeChange={setSelectedPriceRange}
              onClearAll={handleClearAllFilters}
              isMobile={true}
              onClose={() => setIsFilterPanelOpen(false)}
            />
          </div>
        </>
      )}

      <QuickAddModal
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        product={quickAddProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductListingInteractive;