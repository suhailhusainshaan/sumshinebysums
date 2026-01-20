import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

interface HeroSectionProps {
  onShopNowClick: () => void;
}

const HeroSection = ({ onShopNowClick }: HeroSectionProps) => {
  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
      <div className="absolute inset-0">
        <AppImage
          src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg"
          alt="Elegant gold necklace with pearl pendant displayed on white marble surface with soft lighting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <p className="text-caption text-accent font-medium">New Collection 2026</p>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Elegance Redefined
            <span className="block text-primary mt-2">Timeless Beauty</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Discover our exquisite collection of handcrafted artificial jewelry. Premium quality designs that capture the essence of luxury at accessible prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onShopNowClick}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-spring"
            >
              Shop Now
            </button>
            <Link
              href="/product-listing?category=new-arrivals"
              className="px-8 py-4 bg-card border border-border text-foreground rounded-md font-medium hover:bg-muted transition-luxe text-center"
            >
              View New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;