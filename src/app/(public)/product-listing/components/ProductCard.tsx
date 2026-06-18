'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  images?: string[];
  alt: string;
  category?: string;
  brand?: string;
  isFeatured?: boolean;
  onQuickAdd: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard = ({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  images,
  alt,
  category,
  brand,
  isFeatured = false,
  onQuickAdd,
  onWishlistToggle,
  isInWishlist,
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickAdd(id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onWishlistToggle(id);
  };

  return (
    <div className="group relative overflow-hidden bg-porcelain border border-mist transition-luxe hover:border-gold/50 flex flex-col h-full">
      <Link href={`/product-detail?id=${id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist group/image catchlight">
          {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-mist" />}
          
          {images && images.length > 1 ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: `.swiper-prev-${id}`,
                nextEl: `.swiper-next-${id}`,
              }}
              autoplay={{ delay: 3000, disableOnInteraction: true }}
              className="h-full w-full"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <AppImage
                    src={img}
                    alt={`${alt} ${index + 1}`}
                    className="h-full w-full object-cover transition-luxe group-hover:scale-105"
                    onLoad={() => setImageLoaded(true)}
                  />
                </SwiperSlide>
              ))}
              <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-between px-2">
                <button
                  className={`swiper-prev-${id} pointer-events-auto bg-card/60 backdrop-blur-md hover:bg-card p-1.5 rounded-full shadow-warm transition-all opacity-0 group-hover/image:opacity-100`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Icon name="ChevronLeftIcon" size={16} className="text-foreground" />
                </button>
                <button
                  className={`swiper-next-${id} pointer-events-auto bg-card/60 backdrop-blur-md hover:bg-card p-1.5 rounded-full shadow-warm transition-all opacity-0 group-hover/image:opacity-100`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Icon name="ChevronRightIcon" size={16} className="text-foreground" />
                </button>
              </div>
            </Swiper>
          ) : (
            <AppImage
              src={image}
              alt={alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-2 z-20 pointer-events-none">
            {/* {isFeatured && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                Featured
              </span>
            )} */}
            {discount > 0 && (
              <span className="rounded-full bg-error px-3 py-1 text-xs font-medium text-error-foreground">
                -{discount}%
              </span>
            )}
          </div>

          <WishlistButton
            productId={Number(id)}
            className="absolute right-3 top-3 rounded-full bg-card p-2 shadow-warm opacity-0 transition-luxe hover:scale-110 group-hover:opacity-100 z-20"
          />
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-ink/60">
            {[brand, category].filter(Boolean).join(' • ') || slug}
          </p>
          <p className="mb-3 line-clamp-2 font-display text-lg tracking-wide text-ink">{name}</p>

          <div className="mt-auto flex items-center gap-3">
            <span className="font-medium text-ink tracking-wide">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-ink/50 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 mt-auto">
        <button
          onClick={handleQuickAdd}
          className="flex w-full items-center justify-center gap-2 border border-mist bg-velvet px-4 py-3 text-sm tracking-widest uppercase text-porcelain transition-luxe hover:bg-gold hover:border-gold hover:text-velvet"
        >
          <Icon name="ShoppingBagIcon" size={16} />
          Quick Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
