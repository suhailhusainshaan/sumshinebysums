'use client';

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import AddToCartSection from './AddToCartSection';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import StickyAddToCart from './StickyAddToCart';
import VariantShowcase from './VariantShowcase';
import { ProductDetailResponse, RelatedProductResponse } from '../types';

interface ProductDetailInteractiveProps {
  product: ProductDetailResponse;
  relatedProducts: RelatedProductResponse[];
}

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

const asString = (value: unknown) => (typeof value === 'string' ? value : '');
const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const ProductDetailInteractive = ({ product, relatedProducts }: ProductDetailInteractiveProps) => {
  const [cartNotification, setCartNotification] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedVariantId = useMemo(() => {
    const rawVariant = searchParams.get('variant');
    const parsed = rawVariant ? Number(rawVariant) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0];

  const productLevelImages = useMemo(
    () =>
      product.images.map((image) => ({
        id: String(image.id),
        url: image.url ? `${IMG_BASE_URL}${image.url}` : '/assets/images/no_image.png',
        alt: image.altText || product.name,
      })),
    [product.images, product.name]
  );

  const variantLevelImages = useMemo(
    () =>
      (selectedVariant?.images || []).map((image) => ({
        id: String(image.id),
        url: image.url ? `${IMG_BASE_URL}${image.url}` : '/assets/images/no_image.png',
        alt: image.altText || product.name,
      })),
    [product.name, selectedVariant?.images]
  );

  const images = variantLevelImages.length > 0 ? variantLevelImages : productLevelImages;
  const safeImages =
    images.length > 0
      ? images
      : [{ id: 'fallback', url: '/assets/images/no_image.png', alt: product.name }];

  const sizes = product.variants.map((variant) => ({
    id: String(variant.id),
    label: variant.name || variant.sku,
    available: (variant.stockQuantity ?? 0) > 0,
  }));

  const material =
    asString(product.specifications?.material) ||
    asString(product.features?.material) ||
    product.brand?.name ||
    'Not specified';
  const careInstructions =
    asStringArray(product.specifications?.careInstructions).length > 0
      ? asStringArray(product.specifications?.careInstructions)
      : asStringArray(product.features?.careInstructions);
  const shippingInfo =
    asString(product.features?.shippingInfo) ||
    asString(product.specifications?.shippingInfo) ||
    'Shipping details will be shared at checkout based on your location and selected delivery method.';
  const mappedRelatedProducts = relatedProducts.map((related) => ({
    id: String(related.id),
    name: related.name,
    price: related.price,
    originalPrice: related.comparePrice,
    image: related.thumbnail
      ? `${IMG_BASE_URL}${related.thumbnail}`
      : '/assets/images/no_image.png',
    alt: related.images[0]?.altText || related.name,
    category: related.category?.name || 'Product',
  }));

  const handleAddToCart = (_quantity: number, variantId?: string) => {
    if (variantId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('variant', variantId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    setCartNotification(true);
    window.setTimeout(() => setCartNotification(false), 3000);
  };

  return (
    <>
      {cartNotification && (
        <div className="fixed right-4 top-20 z-notification animate-slide-in-right rounded-lg bg-success px-6 py-4 text-success-foreground shadow-warm-lg">
          <div className="flex items-center space-x-3">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <ProductImageGallery
            key={selectedVariant ? `variant-${selectedVariant.id}` : 'product-gallery'}
            images={safeImages}
            productName={product.name}
          />
        </div>

        <div className="space-y-8">
          <ProductInfo
            name={product.name}
            price={selectedVariant?.price ?? product.price}
            originalPrice={selectedVariant?.comparePrice ?? product.comparePrice}
            material={material}
            availability={(selectedVariant?.stockQuantity ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
            sku={selectedVariant?.sku || product.slug}
            brand={product.brand?.name}
            category={product.category?.name}
            featured={product.isFeatured}
          />
          <AddToCartSection
            sizes={sizes}
            showSizeGuide={sizes.length > 1}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      <div className="mb-16">
        <VariantShowcase
          productId={product.id}
          variants={product.variants.map((variant) => ({
            ...variant,
            thumbnail: variant.thumbnail
              ? `${IMG_BASE_URL}${variant.thumbnail}`
              : variant.images[0]?.url
                ? `${IMG_BASE_URL}${variant.images[0].url}`
                : null,
            images: variant.images.map((image) => ({
              ...image,
              url: image.url ? `${IMG_BASE_URL}${image.url}` : '/assets/images/no_image.png',
            })),
          }))}
          selectedVariantId={selectedVariant?.id ?? null}
        />
      </div>

      <div className="mb-16">
        <ProductTabs
          description={product.description || 'No description available for this product yet.'}
          careInstructions={careInstructions}
          reviews={[]}
          shippingInfo={shippingInfo}
          specifications={product.specifications || {}}
          features={product.features || {}}
        />
      </div>

      {mappedRelatedProducts.length > 0 && (
        <div className="mb-16">
          <RelatedProducts products={mappedRelatedProducts} />
        </div>
      )}

      <StickyAddToCart
        productName={product.name}
        price={selectedVariant?.price ?? product.price}
        onAddToCart={() =>
          handleAddToCart(1, selectedVariant ? String(selectedVariant.id) : undefined)
        }
      />
    </>
  );
};

export default ProductDetailInteractive;
