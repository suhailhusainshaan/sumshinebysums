'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Mousewheel, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({ images, productName: _productName }: ProductImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image Slider */}
      <div className="relative group bg-muted rounded-lg overflow-hidden aspect-square">
        <Swiper
          style={
            {
              '--swiper-navigation-color': 'var(--primary)',
              '--swiper-pagination-color': 'var(--primary)',
            } as React.CSSProperties
          }
          spaceBetween={0}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          keyboard={{ enabled: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs, Keyboard]}
          className="h-full w-full"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="h-full w-full">
                <AppImage
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="h-full w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-card/60 backdrop-blur-md hover:bg-card p-3 rounded-full shadow-warm transition-all opacity-0 group-hover:opacity-100 disabled:hidden">
              <Icon name="ChevronLeftIcon" size={24} className="text-foreground" />
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-card/60 backdrop-blur-md hover:bg-card p-3 rounded-full shadow-warm transition-all opacity-0 group-hover:opacity-100 disabled:hidden">
              <Icon name="ChevronRightIcon" size={24} className="text-foreground" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute top-4 right-4 z-10 bg-card/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <span className="text-caption font-bold text-foreground drop-shadow-sm">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="relative group/thumbs px-8">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={5.5}
          freeMode={true}
          mousewheel={true}
          watchSlidesProgress={true}
          navigation={{
            prevEl: '.thumbs-prev',
            nextEl: '.thumbs-next',
          }}
          modules={[FreeMode, Navigation, Thumbs, Mousewheel]}
          className="thumbs-swiper !overflow-visible"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`thumb-${image.id}`} className="cursor-pointer">
              <div
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === activeIndex
                    ? 'border-primary ring-2 ring-primary/20 scale-105 z-10'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <AppImage src={image.url} alt={image.alt} fill className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 5 && (
          <>
            <button className="thumbs-prev absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-card/90 hover:bg-card p-1.5 rounded-full shadow-warm transition-all opacity-0 group-hover/thumbs:opacity-100 disabled:hidden">
              <Icon name="ChevronLeftIcon" size={18} className="text-foreground" />
            </button>
            <button className="thumbs-next absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-card/90 hover:bg-card p-1.5 rounded-full shadow-warm transition-all opacity-0 group-hover/thumbs:opacity-100 disabled:hidden">
              <Icon name="ChevronRightIcon" size={18} className="text-foreground" />
            </button>
          </>
        )}
      </div>

      <style jsx global>{`
        .thumbs-swiper .swiper-slide-thumb-active {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ProductImageGallery;
