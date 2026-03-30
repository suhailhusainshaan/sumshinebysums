'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Badge from '@/components/ui/badge/Badge';
import toast from 'react-hot-toast';

interface VariantImageState {
  id: string;
  previewUrl: string;
  altText: string;
  isNew: boolean;
  isObjectUrl: boolean;
  displayOrder: number;
  featureImage?: boolean;
}

const FALLBACK_IMAGE = '/images/fallbacks/no_product.jpg';

export default function EditVariantPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const variantId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    stockQuantity: '',
    displayOrder: '',
    weight: '',
    dimensions: {
      unit: 'cm',
      width: '',
      height: '',
      length: '',
    },
    active: true,
  });

  const [images, setImages] = useState<VariantImageState[]>([]);

  const imageCountLabel = useMemo(() => `${images.length} image(s)`, [images.length]);

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timer = setTimeout(() => setSaveStatus('idle'), 2500);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    if (!variantId) return;
    try {
      const stored = sessionStorage.getItem(`variant:${variantId}`);
      if (!stored) return;
      const parsed = JSON.parse(stored);

      setFormData((prev) => ({
        ...prev,
        name: parsed.name || prev.name,
        sku: parsed.sku || prev.sku,
        description: parsed.description || prev.description,
        price: parsed.price !== null && parsed.price !== undefined ? String(parsed.price) : prev.price,
        compareAtPrice:
          parsed.compareAtPrice !== null && parsed.compareAtPrice !== undefined
            ? String(parsed.compareAtPrice)
            : prev.compareAtPrice,
        costPrice:
          parsed.costPrice !== null && parsed.costPrice !== undefined
            ? String(parsed.costPrice)
            : prev.costPrice,
        stockQuantity:
          parsed.stockQuantity !== null && parsed.stockQuantity !== undefined
            ? String(parsed.stockQuantity)
            : prev.stockQuantity,
        displayOrder:
          parsed.displayOrder !== null && parsed.displayOrder !== undefined
            ? String(parsed.displayOrder)
            : prev.displayOrder,
        weight:
          parsed.weight !== null && parsed.weight !== undefined ? String(parsed.weight) : prev.weight,
        dimensions: {
          ...prev.dimensions,
          unit: parsed.dimensionsJson?.unit || prev.dimensions.unit,
          width: parsed.dimensionsJson?.width || prev.dimensions.width,
          height: parsed.dimensionsJson?.height || prev.dimensions.height,
          length: parsed.dimensionsJson?.length || prev.dimensions.length,
        },
        active: parsed.active ?? prev.active,
      }));

      if (Array.isArray(parsed.images)) {
        const mappedImages = parsed.images.map((image: any, index: number) => ({
          id: `existing-${image.id ?? index}`,
          previewUrl: image.imageUrl
            ? `${process.env.NEXT_PUBLIC_IMG_URL || ''}${image.imageUrl}`
            : FALLBACK_IMAGE,
          altText: image.altText || parsed.name || `Image ${index + 1}`,
          isNew: false,
          isObjectUrl: false,
          displayOrder: image.displayOrder ?? index,
          featureImage: image.featureImage ?? false,
        }));
        setImages(mappedImages);
      }
    } catch (error) {
      console.warn('Failed to load stored variant data', error);
    }
  }, [variantId]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.isObjectUrl) URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [images]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const nextValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: nextValue,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: nextValue }));
    }

    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const nextImages: VariantImageState[] = Array.from(files).map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `new-${Date.now()}-${index}`,
        previewUrl,
        altText: file.name,
        isNew: true,
        isObjectUrl: true,
        displayOrder: images.length + index,
      };
    });

    setImages((prev) => [...prev, ...nextImages]);
    event.target.value = '';
  };

  const handleRemoveImage = (imageId: string) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === imageId);
      if (target?.isObjectUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((image) => image.id !== imageId);
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      toast.success('Variant changes saved (local only).');
    }, 600);
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb
        pageTitle="Edit Variant"
        crumbs={[{ label: 'Product Management', href: '/admin/product' }]}
      />

      <div className="space-y-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ComponentCard title="Variant Details" desc="Manage variant fields and inventory">
            {saveStatus === 'saved' && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Changes saved locally. API integration can be added later.
              </div>
            )}
            {variantId && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-400">
                <span>
                  Variant ID:{' '}
                  <strong className="text-gray-700 dark:text-white/80">{variantId}</strong>
                </span>
                <span>
                  Status:{' '}
                  <strong className="text-gray-700 dark:text-white/80">
                    {formData.active ? 'Active' : 'Draft'}
                  </strong>
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Variant Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Compare At Price</Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="dimensions.length">Length</Label>
                <Input
                  id="dimensions.length"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="dimensions.width">Width</Label>
                <Input
                  id="dimensions.width"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="dimensions.height">Height</Label>
                <Input
                  id="dimensions.height"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500"
                />
                <Label htmlFor="active" className="mb-0">
                  Active Variant
                </Label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="px-6 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
              </button>
            </div>
          </ComponentCard>

          <ComponentCard title="Variant Images" desc="Upload or remove images for this variant">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{imageCountLabel}</p>
                <p className="text-xs text-gray-400">New images stay local until API is ready.</p>
              </div>
              <label className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] cursor-pointer">
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                Upload Images
              </label>
            </div>

            {images.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                No images added yet.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]"
                  >
                    <div className="group relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={image.previewUrl}
                        alt={image.altText}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                      {image.featureImage && (
                        <span className="absolute left-2 top-2">
                          <Badge size="sm" color="primary">
                            Featured
                          </Badge>
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Order: {image.displayOrder}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="text-error-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ComponentCard>
        </form>
      </div>
    </div>
  );
}
