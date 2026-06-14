import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { HomepageHeroMediaAsset } from '../types';
import { resolveImageSrc } from '@/lib/image';

interface HeroSectionProps {
  onShopNowClick: () => void;
  heroMediaAsset?: HomepageHeroMediaAsset | null;
}

const DEFAULT_HERO_IMAGE = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg';
const DEFAULT_HERO_ALT =
  'Elegant gold necklace with pearl pendant displayed on white marble surface with soft lighting';

const HeroSection = ({ onShopNowClick, heroMediaAsset = null }: HeroSectionProps) => {
  const heroImageUrl = heroMediaAsset?.url
    ? heroMediaAsset.url.startsWith('http://') || heroMediaAsset.url.startsWith('https://')
      ? heroMediaAsset.url
      : resolveImageSrc(heroMediaAsset.url)
    : DEFAULT_HERO_IMAGE;
  const heroImageAlt = heroMediaAsset?.altText || DEFAULT_HERO_ALT;

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
      <div className="absolute inset-0">
        <AppImage src={heroImageUrl} alt={heroImageAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <p className="text-caption text-accent font-medium"></p>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">

            <span className="block text-primary mt-2"></span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl">

          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onShopNowClick}
              className="px-12 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-spring min-w-[200px]"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
