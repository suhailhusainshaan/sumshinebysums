'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  alt: string;
  badge?: string;
  category: string;
}

const BestsellersSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const products: Product[] = [
    {
      id: '1',
      name: 'Celestial Pearl Necklace',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviewCount: 234,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
      alt: 'Elegant pearl necklace with gold chain and teardrop pendant on white background',
      badge: 'Bestseller',
      category: 'necklaces',
    },
    {
      id: '2',
      name: 'Rose Gold Drop Earrings',
      price: 45.99,
      rating: 4.9,
      reviewCount: 189,
      image: 'https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg',
      alt: 'Rose gold chandelier earrings with crystal accents on velvet display',
      badge: 'Trending',
      category: 'earrings',
    },
    {
      id: '3',
      name: 'Infinity Charm Bracelet',
      price: 59.99,
      rating: 4.7,
      reviewCount: 156,
      image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
      alt: 'Silver bracelet with infinity symbol charm and adjustable chain',
      category: 'bracelets',
    },
    {
      id: '4',
      name: 'Vintage Cocktail Ring',
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.6,
      reviewCount: 142,
      image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg',
      alt: 'Gold vintage style ring with large emerald green stone and ornate band',
      badge: 'Sale',
      category: 'rings',
    },
    {
      id: '5',
      name: 'Bridal Jewelry Set',
      price: 149.99,
      rating: 5.0,
      reviewCount: 98,
      image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
      alt: 'Complete bridal jewelry set with necklace earrings and bracelet in silver finish',
      badge: 'Premium',
      category: 'sets',
    },
    {
      id: '6',
      name: 'Layered Chain Necklace',
      price: 54.99,
      rating: 4.8,
      reviewCount: 201,
      image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      alt: 'Multi-layered gold chain necklace with varying lengths on white fabric',
      category: 'necklaces',
    },
    {
      id: '7',
      name: 'Crystal Stud Earrings',
      price: 29.99,
      rating: 4.9,
      reviewCount: 312,
      image: 'https://images.pixabay.com/photo/2017/08/01/00/38/jewelry-2562598_1280.jpg',
      alt: 'Round crystal stud earrings in silver setting with brilliant cut stones',
      badge: 'Bestseller',
      category: 'earrings',
    },
    {
      id: '8',
      name: 'Bohemian Bangle Set',
      price: 64.99,
      rating: 4.7,
      reviewCount: 167,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
      alt: 'Set of five gold bangles with intricate bohemian patterns and textures',
      category: 'bracelets',
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`full-${i}`} name="StarIcon" size={16} variant="solid" className="text-accent" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarIcon" size={16} className="text-accent" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="StarIcon" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Bestsellers
            </h2>
            <p className="text-lg text-muted-foreground">
              Our most loved pieces, chosen by customers like you
            </p>
          </div>
          <Link
            href="/product-listing"
            className="hidden sm:flex items-center space-x-2 text-primary hover:text-accent transition-luxe font-medium"
          >
            <span>View All</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product-detail?id=${product.id}`}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-warm-lg transition-luxe"
            >
              <div className="relative h-80 overflow-hidden bg-muted">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-spring duration-500"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-caption font-medium rounded-full">
                    {product.badge}
                  </div>
                )}
                <button
                  className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-luxe"
                  aria-label="Add to wishlist"
                >
                  <Icon name="HeartIcon" size={20} className="text-foreground" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-foreground mb-2 line-clamp-1">
                  {product.name}
                </h3>

                {isHydrated && (
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-caption text-muted-foreground ml-2">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-data text-lg font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-data text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/product-listing"
            className="inline-flex items-center space-x-2 text-primary hover:text-accent transition-luxe font-medium"
          >
            <span>View All Products</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;