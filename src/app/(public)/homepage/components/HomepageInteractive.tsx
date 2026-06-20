'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import SearchComponent from '@/components/common/SearchComponent';
import HeroSection from './HeroSection';
import HomepageSlider from '@/components/HomepageSlider/HomepageSlider';
import CategoriesSection from './CategoriesSection';
import HomepageContactInfo from './HomepageContactInfo';
import Footer from './Footer';
import {
  HomepageCategory,
  HomepageFeaturedProduct,
  HomepageHeroMediaAsset,
  HomepageSlider as HomepageSliderType,
} from '../types';
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
  categories: HomepageCategory[];
  featuredProducts: HomepageFeaturedProduct[];
  bestsellers: ProductListingItem[];
  newArrivals: ProductListingItem[];
  heroMediaAsset: HomepageHeroMediaAsset | null;
  homepageSliders: HomepageSliderType[];
}

const HomepageInteractive = ({
  categories = [],
  featuredProducts: _featuredProducts = [],
  bestsellers: _bestsellers = [],
  newArrivals: _newArrivals = [],
  heroMediaAsset = null,
  homepageSliders = [],
}: HomepageInteractiveProps) => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = async (_query: string): Promise<SearchResult[]> => {
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => router.push('/shopping-cart')}
      />

      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      <main className="pt-16 lg:pt-18">
        <HomepageSlider slides={homepageSliders} />
        {/*<HeroSection onShopNowClick={handleShopNowClick} heroMediaAsset={heroMediaAsset} />*/}
        {/*<TrustBadgesSection />*/}
        <CategoriesSection categories={categories} />
        {/*<FeaturedCollections products={featuredProducts} />*/}
        {/*<BestsellersSection products={bestsellers} />*/}
        {/*<NewArrivalsSection products={newArrivals} />*/}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HomepageContactInfo />
          </div>
        </section>

        {/* 
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Icon name="EnvelopeIcon" size={32} className="text-primary" />
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to receive exclusive offers, style tips, and be the first to know about new
              collections
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-luxe"
                />
                <button
                  type="submit"
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-spring whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-caption text-muted-foreground mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates
              </p>
            </form>
          </div>
        </section>
        */}
      </main>

      <Footer categories={categories} />
    </div>
  );
};

export default HomepageInteractive;
