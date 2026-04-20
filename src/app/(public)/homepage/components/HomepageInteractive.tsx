'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import MobileHamburgerMenu from '@/components/common/MobileHamburgerMenu';
import SearchComponent from '@/components/common/SearchComponent';
import HeroSection from './HeroSection';
import FeaturedCollections from './FeaturedCollections';
import BestsellersSection from './BestsellersSection';
import NewArrivalsSection from './NewArrivalsSection';
import NewsletterSection from './NewsletterSection';
import TrustBadgesSection from './TrustBadgesSection';
import Footer from './Footer';
import { HomepageFeaturedProduct } from '../types';
import { ProductListingItem } from '@/app/(public)/product-listing/types';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  path: string;
}

interface HomepageInteractiveProps {
  featuredProducts: HomepageFeaturedProduct[];
  bestsellers: ProductListingItem[];
  newArrivals: ProductListingItem[];
}

const HomepageInteractive = ({
  featuredProducts = [],
  bestsellers = [],
  newArrivals = [],
}: HomepageInteractiveProps) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemCount] = useState(3);

  const handleShopNowClick = () => {
    router.push('/product-listing');
  };

  const handleSearch = async (_query: string): Promise<SearchResult[]> => {
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => router.push('/shopping-cart')}
      />

      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartItemCount={cartItemCount}
      />

      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      <main className="pt-16 lg:pt-18">
        <HeroSection onShopNowClick={handleShopNowClick} />
        <TrustBadgesSection />
        <FeaturedCollections products={featuredProducts} />
        <BestsellersSection products={bestsellers} />
        <NewArrivalsSection products={newArrivals} />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomepageInteractive;
