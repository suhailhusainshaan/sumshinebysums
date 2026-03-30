'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Badge from '@/components/ui/badge/Badge';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface VariantImage {
  id: number;
  imageUrl: string;
  altText?: string;
  displayOrder?: number | null;
  featureImage?: boolean;
}

interface Variant {
  id: number;
  name: string;
  sku: string;
  price: number | null;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  stockQuantity?: number | null;
  displayOrder?: number | null;
  weight?: number | null;
  dimensionsJson?: {
    unit?: string;
    width?: string;
    height?: string;
    length?: string;
  } | null;
  images?: VariantImage[] | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductResponse {
  data: {
    id: number;
    name: string;
    slug: string;
    description: string;
    published: boolean;
    displayOrder: number | null;
    createdAt?: string;
    updatedAt?: string;
    price?: number | null;
    brand?: { id: number; name: string } | null;
    category?: { id: number; name: string } | null;
    features?: {
      material?: string;
      finish?: string;
      hypoallergenic?: boolean;
    } | null;
    specifications?: {
      material?: string;
      purity?: string;
      stone_type?: string;
      hypoallergenic?: boolean;
    } | null;
    variants?: Variant[] | null;
  };
}

const FALLBACK_IMAGE = '/images/fallbacks/no_product.jpg';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

export default function ViewProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductResponse['data'] | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);

  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [variants]);

  const summary = useMemo(() => {
    const variantCount = variants.length;
    const totalStock = variants.reduce((sum, variant) => sum + (variant.stockQuantity ?? 0), 0);
    const imagesCount = variants.reduce(
      (sum, variant) => sum + (variant.images?.length ?? 0),
      0
    );
    const priceValues = variants
      .map((variant) => variant.price)
      .filter((price): price is number => typeof price === 'number');
    if (priceValues.length === 0 && typeof product?.price === 'number') {
      priceValues.push(product.price);
    }
    const priceMin = priceValues.length ? Math.min(...priceValues) : null;
    const priceMax = priceValues.length ? Math.max(...priceValues) : null;
    const priceRange =
      priceMin === null
        ? '—'
        : priceMin === priceMax
          ? `${priceMin}`
          : `${priceMin} – ${priceMax}`;

    return { variantCount, totalStock, priceRange, imagesCount };
  }, [variants, product?.price]);

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get<ProductResponse>(`/admin/products/${productId}`);
        if (!isMounted) return;
        setProduct(response.data.data);
        setVariants(response.data.data.variants || []);
      } catch (error) {
        console.error('Failed to load product details', error);
        toast.error('Unable to load product details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const getVariantImages = (variant: Variant) => {
    if (!variant.images || variant.images.length === 0) return [];
    return [...variant.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  };

  const getImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return FALLBACK_IMAGE;
    return `${process.env.NEXT_PUBLIC_IMG_URL || ''}${imageUrl}`;
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb
        pageTitle="View Product"
        crumbs={[{ label: 'Product Management', href: '/admin/product' }]}
      />

      <div className="space-y-6 mt-6">
        <ComponentCard
          title="Product Overview"
          desc="Full product details, status, and metadata"
          hasButton
          buttonText="Edit Product"
          buttonAction={`/admin/product/${productId}/edit`}
        >
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-7 w-56 rounded-lg bg-gray-100 dark:bg-white/[0.05]" />
              <div className="h-4 w-40 rounded bg-gray-100 dark:bg-white/[0.05]" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`summary-skel-${index}`}
                    className="h-10 rounded-full bg-gray-100 dark:bg-white/[0.05]"
                  />
                ))}
              </div>
              <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`overview-skel-${index}`}
                    className="h-20 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                  />
                ))}
              </div>
              <div className="h-24 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={`feature-skel-${index}`}
                    className="h-32 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                  />
                ))}
              </div>
            </div>
          ) : !product ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              Product not found.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500">Slug: {product.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge size="sm" color={product.published ? 'success' : 'warning'}>
                    {product.published ? 'Published' : 'Draft'}
                  </Badge>
                  <Badge size="sm" color="light">
                    ID: {product.id}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
                  <span className="text-xs uppercase tracking-wide text-gray-400">Variants</span>
                  <span className="font-semibold text-gray-700 dark:text-white/80">
                    {summary.variantCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
                  <span className="text-xs uppercase tracking-wide text-gray-400">Total Stock</span>
                  <span className="font-semibold text-gray-700 dark:text-white/80">
                    {summary.totalStock}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
                  <span className="text-xs uppercase tracking-wide text-gray-400">Price Range</span>
                  <span className="font-semibold text-gray-700 dark:text-white/80">
                    {summary.priceRange}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-400">
                <span>
                  Images: <strong className="text-gray-700 dark:text-white/80">{summary.imagesCount}</strong>
                </span>
                <span>
                  Last Updated:{' '}
                  <strong className="text-gray-700 dark:text-white/80">
                    {formatDate(product.updatedAt)}
                  </strong>
                </span>
                <span>
                  Created:{' '}
                  <strong className="text-gray-700 dark:text-white/80">
                    {formatDate(product.createdAt)}
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Category</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {product.category?.name || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Brand</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {product.brand?.name || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Display Order</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {product.displayOrder ?? '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Created</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Updated</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Base Price</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {product.price ?? '—'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <p className="text-xs uppercase tracking-wide text-gray-400">Description</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {product.description || '—'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Features</p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>Material: {product.features?.material || '—'}</p>
                    <p>Finish: {product.features?.finish || '—'}</p>
                    <p>
                      Hypoallergenic:{' '}
                      {product.features?.hypoallergenic ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Specifications</p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>Material: {product.specifications?.material || '—'}</p>
                    <p>Purity: {product.specifications?.purity || '—'}</p>
                    <p>Stone Type: {product.specifications?.stone_type || '—'}</p>
                    <p>
                      Hypoallergenic:{' '}
                      {product.specifications?.hypoallergenic ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>

        <ComponentCard title="Variants & Images" desc="All variants with image galleries">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`variant-skel-${index}`}
                  className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800"
                >
                  <div className="h-5 w-40 rounded bg-gray-100 dark:bg-white/[0.05]" />
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((__, statIndex) => (
                      <div
                        key={`variant-stat-${index}-${statIndex}`}
                        className="h-14 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                      />
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((__, imageIndex) => (
                      <div
                        key={`variant-image-${index}-${imageIndex}`}
                        className="h-32 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : sortedVariants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No variants found for this product yet.
            </div>
          ) : (
            <div className="space-y-6">
              {sortedVariants.map((variant) => {
                const images = getVariantImages(variant);
                return (
                  <div
                    key={variant.id}
                    className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            {variant.name}
                          </h3>
                          <Badge size="sm" color={variant.active ? 'success' : 'warning'}>
                            {variant.active ? 'Active' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                      </div>
                      <Link
                        href={`/admin/product/variant/${variant.id}/edit`}
                        className="text-sm font-medium text-brand-500 hover:underline"
                      >
                        Edit Variant
                      </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Price</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                          {variant.price ?? '—'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Compare At
                        </p>
                        <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                          {variant.compareAtPrice ?? '—'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Stock</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                          {variant.stockQuantity ?? '—'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Display Order
                        </p>
                        <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                          {variant.displayOrder ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-wide text-gray-400">Images</p>
                      {images.length === 0 ? (
                        <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                          No images uploaded for this variant yet.
                        </div>
                      ) : (
                        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                          {images.map((image) => (
                            <div
                              key={image.id}
                              className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]"
                            >
                              <div className="group relative h-28 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-zoom-in">
                                <Image
                                  src={getImageSrc(image.imageUrl)}
                                  alt={image.altText || variant.name}
                                  fill
                                  className="object-cover transition duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                Order: {image.displayOrder ?? 0}
                                {image.featureImage ? ' • Featured' : ''}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
