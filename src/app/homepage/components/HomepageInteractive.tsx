'use client';

import React, { useState, useEffect } from 'react';
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

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  path: string;
}

const HomepageInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemCount] = useState(3);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleShopNowClick = () => {
    router.push('/product-listing');
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        name: 'Celestial Pearl Necklace',
        category: 'Necklaces',
        price: 89.99,
        image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
        path: '/product-detail?id=1',
      },
      {
        id: '2',
        name: 'Rose Gold Drop Earrings',
        category: 'Earrings',
        price: 45.99,
        image: 'https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg',
        path: '/product-detail?id=2',
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockResults.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  const handleCartClick = () => {
    router.push('/shopping-cart');
  };

  const handleViewCart = () => {
    router.push('/shopping-cart');
  };

  const mockCartItems = [
    {
      id: '1',
      name: 'Celestial Pearl Necklace',
      price: 89.99,
      quantity: 1,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    },
    {
      id: '2',
      name: 'Rose Gold Drop Earrings',
      price: 45.99,
      quantity: 2,
      image: 'https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg',
    },
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 lg:h-18 bg-card shadow-warm" />
        <main className="pt-16 lg:pt-18">
          <div className="h-[600px] lg:h-[700px] bg-muted animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onSearchClick={handleSearchClick}
        onCartClick={handleCartClick}
      />

      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartItemCount={cartItemCount}
      />

      <SearchComponent
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        onSearch={handleSearch}
      />

      <main className="pt-16 lg:pt-18">
        <HeroSection onShopNowClick={handleShopNowClick} />
        <TrustBadgesSection />
        <FeaturedCollections />
        <BestsellersSection />
        <NewArrivalsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomepageInteractive;