'use client';

import React, { useState } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import AddToCartSection from './AddToCartSection';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import StickyAddToCart from './StickyAddToCart';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface SizeOption {
  id: string;
  label: string;
  available: boolean;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  category: string;
}

interface ProductData {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  material: string;
  availability: string;
  sku: string;
  images: ProductImage[];
  sizes?: SizeOption[];
  description: string;
  careInstructions: string[];
  reviews: Review[];
  shippingInfo: string;
  relatedProducts: RelatedProduct[];
}

interface ProductDetailInteractiveProps {
  productData: ProductData;
}

const ProductDetailInteractive = ({ productData }: ProductDetailInteractiveProps) => {
  const [cartNotification, setCartNotification] = useState(false);

  const handleAddToCart = (quantity: number, size?: string) => {
    console.log('Adding to cart:', { quantity, size, product: productData.name });
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 3000);
  };

  return (
    <>
      {/* Cart Notification */}
      {cartNotification && (
        <div className="fixed top-20 right-4 bg-success text-success-foreground px-6 py-4 rounded-lg shadow-warm-lg z-notification animate-slide-in-right">
          <div className="flex items-center space-x-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Added to cart successfully!</span>
          </div>
        </div>
      )}

      {/* Main Product Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <ProductImageGallery images={productData.images} productName={productData.name} />
        </div>

        {/* Product Information & Add to Cart */}
        <div className="space-y-8">
          <ProductInfo
            name={productData.name}
            price={productData.price}
            originalPrice={productData.originalPrice}
            rating={productData.rating}
            reviewCount={productData.reviewCount}
            material={productData.material}
            availability={productData.availability}
            sku={productData.sku}
          />
          <AddToCartSection
            sizes={productData.sizes}
            showSizeGuide={!!productData.sizes && productData.sizes.length > 0}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <ProductTabs
          description={productData.description}
          careInstructions={productData.careInstructions}
          reviews={productData.reviews}
          shippingInfo={productData.shippingInfo}
        />
      </div>

      {/* Related Products */}
      <div className="mb-16">
        <RelatedProducts products={productData.relatedProducts} />
      </div>

      {/* Sticky Add to Cart (Mobile) */}
      <StickyAddToCart
        productName={productData.name}
        price={productData.price}
        onAddToCart={() => handleAddToCart(1)}
      />
    </>
  );
};

export default ProductDetailInteractive;