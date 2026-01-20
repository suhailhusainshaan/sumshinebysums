'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
        <AppImage
          src={images[selectedImageIndex].url}
          alt={images[selectedImageIndex].alt}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={toggleZoom}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card p-3 rounded-full shadow-warm transition-luxe"
              aria-label="Previous image"
            >
              <Icon name="ChevronLeftIcon" size={24} className="text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card p-3 rounded-full shadow-warm transition-luxe"
              aria-label="Next image"
            >
              <Icon name="ChevronRightIcon" size={24} className="text-foreground" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-card/90 px-3 py-2 rounded-md flex items-center space-x-2">
          <Icon name="MagnifyingGlassPlusIcon" size={16} className="text-muted-foreground" />
          <span className="text-caption text-muted-foreground">Click to zoom</span>
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-card/90 px-3 py-1 rounded-md">
          <span className="text-caption text-foreground">
            {selectedImageIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-luxe ${
              index === selectedImageIndex
                ? 'border-primary shadow-warm'
                : 'border-border hover:border-primary/50'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <AppImage
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;