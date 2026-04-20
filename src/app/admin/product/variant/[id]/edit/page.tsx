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
import api from '@/lib/axios';
import { useDropzone } from 'react-dropzone';

interface VariantImageState {
  id: string;
  originalId?: number;
  previewUrl: string;
  altText: string;
  isNew: boolean;
  isObjectUrl: boolean;
  displayOrder: number;
  featureImage?: boolean;
  file?: File;
}

const FALLBACK_IMAGE = '/images/fallbacks/no_product.jpg';

export default function EditVariantPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const variantId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const [isOrdering, setIsOrdering] = useState(false);

  const fetchVariant = async () => {
    if (!variantId) return;
    setLoading(true);
    try {
      const response = await api.get(`/admin/product/variants/${variantId}`);
      const payload = response.data?.data;
      if (!payload) return;

      setFormData((prev) => ({
        ...prev,
        name: payload.name ?? '',
        sku: payload.sku ?? '',
        description: payload.description ?? '',
        price: payload.price !== null && payload.price !== undefined ? String(payload.price) : '',
        compareAtPrice:
          payload.compareAtPrice !== null && payload.compareAtPrice !== undefined
            ? String(payload.compareAtPrice)
            : '',
        costPrice:
          payload.costPrice !== null && payload.costPrice !== undefined
            ? String(payload.costPrice)
            : '',
        stockQuantity:
          payload.stockQuantity !== null && payload.stockQuantity !== undefined
            ? String(payload.stockQuantity)
            : '',
        displayOrder:
          payload.displayOrder !== null && payload.displayOrder !== undefined
            ? String(payload.displayOrder)
            : '',
        weight:
          payload.weight !== null && payload.weight !== undefined ? String(payload.weight) : '',
        dimensions: {
          ...prev.dimensions,
          unit: payload.dimensionsJson?.unit || prev.dimensions.unit,
          width: payload.dimensionsJson?.width || '',
          height: payload.dimensionsJson?.height || '',
          length: payload.dimensionsJson?.length || '',
        },
        active: payload.active ?? true,
      }));

      if (Array.isArray(payload.images)) {
        const mappedImages = payload.images.map((image: any, index: number) => ({
          id: `existing-${image.id ?? index}`,
          originalId: image.id,
          previewUrl: image.imageUrl
            ? `${process.env.NEXT_PUBLIC_IMG_URL || ''}${image.imageUrl}`
            : FALLBACK_IMAGE,
          altText: image.altText || payload.name || `Image ${index + 1}`,
          isNew: false,
          isObjectUrl: false,
          displayOrder: image.displayOrder ?? index,
          featureImage: image.featureImage ?? false,
        }));
        setImages(mappedImages);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to load variant details', error);
      toast.error('Unable to load variant details.');
    } finally {
      setLoading(false);
    }
  };

  const imageCountLabel = useMemo(() => `${images.length} image(s)`, [images.length]);

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timer = setTimeout(() => setSaveStatus('idle'), 2500);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    fetchVariant();
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
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const appendFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const maxOrder = images.reduce((max, image) => Math.max(max, image.displayOrder ?? 0), 0);
    const nextImages: VariantImageState[] = files.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `new-${Date.now()}-${index}`,
        previewUrl,
        altText: file.name,
        isNew: true,
        isObjectUrl: true,
        displayOrder: maxOrder + index + 1,
        file,
      };
    });
    setImages((prev) => [...prev, ...nextImages]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    appendFiles(Array.from(files));
    event.target.value = '';
  };

  const onDrop = (acceptedFiles: File[]) => {
    appendFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/webp': [], 'image/svg+xml': [] },
    maxFiles: 10,
  });

  const handleRemoveImage = async (imageId: string) => {
    const target = images.find((image) => image.id === imageId);
    if (!target) return;

    if (target.isNew) {
      if (target.isObjectUrl) URL.revokeObjectURL(target.previewUrl);
      setImages((prev) => prev.filter((image) => image.id !== imageId));
      return;
    }

    if (!variantId || !target.originalId) {
      toast.error('Unable to delete image.');
      return;
    }

    try {
      const response = await api.delete(
        `/admin/product/variants/${variantId}/images/${target.originalId}`
      );
      if (response.data?.status === 200) {
        setImages((prev) => prev.filter((image) => image.id !== imageId));
        toast.success(response.data?.message || 'Image deleted');
      } else {
        toast.error(response.data?.message || 'Unable to delete image.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete image.');
    }
  };

  const handleSetFeature = (imageId: string) => {
    setImages((prev) =>
      prev.map((image) => ({
        ...image,
        featureImage: image.id === imageId,
      }))
    );
  };

  const handleOrderChange = (imageId: string, value: string) => {
    const nextValue = Number(value);
    setImages((prev) =>
      prev.map((image) =>
        image.id === imageId
          ? { ...image, displayOrder: Number.isNaN(nextValue) ? 0 : nextValue }
          : image
      )
    );
  };

  const handleSaveOrder = async () => {
    if (!variantId) return;
    const existing = images.filter((image) => !image.isNew && image.originalId);
    if (existing.length === 0) {
      toast.error('No saved images to reorder.');
      return;
    }
    setIsOrdering(true);
    try {
      const payload = {
        images: existing.map((image) => ({
          id: image.originalId,
          displayOrder: image.displayOrder ?? 0,
          featureImage: !!image.featureImage,
        })),
      };
      const response = await api.put(`/admin/product/variants/${variantId}/images/order`, payload);
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Image order updated');
        fetchVariant();
      } else {
        toast.error(response.data?.message || 'Unable to update image order.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update image order.');
    } finally {
      setIsOrdering(false);
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Variant name is required';
    if (!formData.sku.trim()) nextErrors.sku = 'SKU is required';
    if (formData.price && Number(formData.price) < 0) nextErrors.price = 'Price must be positive';
    if (formData.stockQuantity && Number(formData.stockQuantity) < 0) {
      nextErrors.stockQuantity = 'Stock cannot be negative';
    }
    if (formData.displayOrder && Number.isNaN(Number(formData.displayOrder))) {
      nextErrors.displayOrder = 'Display order must be a number';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitVariantUpdate = async () => {
    if (!variantId) return;
    if (!validateForm()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setSaveStatus('saving');

      const payload = {
        sku: formData.sku,
        name: formData.name,
        price: formData.price ? Number(formData.price) : null,
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      costPrice: formData.costPrice ? Number(formData.costPrice) : null,
      stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : null,
      displayOrder: formData.displayOrder ? Number(formData.displayOrder) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      dimensionsJson: {
        unit: formData.dimensions.unit,
        width: formData.dimensions.width,
        height: formData.dimensions.height,
        length: formData.dimensions.length,
      },
      active: formData.active,
    };

      const newImages = images.filter((image) => image.isNew && image.file);

    try {
      let response;
      if (newImages.length > 0) {
        const form = new FormData();
        form.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        newImages.forEach((image) => {
          if (image.file) form.append('images', image.file);
        });
        response = await api.put(`/admin/product/variants/${variantId}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.put(`/admin/product/variants/${variantId}`, payload);
      }

      const updated = response.data?.data;
      if (updated) {
        setFormData((prev) => ({
          ...prev,
          sku: updated.sku ?? prev.sku,
          name: updated.name ?? prev.name,
          price: updated.price !== null && updated.price !== undefined ? String(updated.price) : '',
          compareAtPrice:
            updated.compareAtPrice !== null && updated.compareAtPrice !== undefined
              ? String(updated.compareAtPrice)
              : '',
          costPrice:
            updated.costPrice !== null && updated.costPrice !== undefined
              ? String(updated.costPrice)
              : '',
          stockQuantity:
            updated.stockQuantity !== null && updated.stockQuantity !== undefined
              ? String(updated.stockQuantity)
              : '',
          displayOrder:
            updated.displayOrder !== null && updated.displayOrder !== undefined
              ? String(updated.displayOrder)
              : '',
          weight:
            updated.weight !== null && updated.weight !== undefined ? String(updated.weight) : '',
          dimensions: {
            ...prev.dimensions,
            unit: updated.dimensionsJson?.unit || prev.dimensions.unit,
            width: updated.dimensionsJson?.width || '',
            height: updated.dimensionsJson?.height || '',
            length: updated.dimensionsJson?.length || '',
          },
          active: updated.active ?? prev.active,
        }));

        if (Array.isArray(updated.images)) {
          const mappedImages = updated.images.map((image: any, index: number) => ({
            id: `existing-${image.id ?? index}`,
            originalId: image.id,
            previewUrl: image.imageUrl
              ? `${process.env.NEXT_PUBLIC_IMG_URL || ''}${image.imageUrl}`
              : FALLBACK_IMAGE,
            altText: image.altText || updated.name || `Image ${index + 1}`,
            isNew: false,
            isObjectUrl: false,
            displayOrder: image.displayOrder ?? index,
            featureImage: image.featureImage ?? false,
          }));
          setImages(mappedImages);
        }
      }

      toast.success(response.data?.message || 'Variant updated.');
      setSaveStatus('saved');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update variant.');
      setSaveStatus('idle');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitVariantUpdate();
  };

  const handleSaveImages = async () => {
    await submitVariantUpdate();
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
                Variant updated successfully.
              </div>
            )}
            {loading && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.02]">
                Loading variant details...
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
                {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
                {errors.sku && <p className="mt-1 text-xs text-error-500">{errors.sku}</p>}
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
                {errors.price && <p className="mt-1 text-xs text-error-500">{errors.price}</p>}
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
                {errors.stockQuantity && (
                  <p className="mt-1 text-xs text-error-500">{errors.stockQuantity}</p>
                )}
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
                {errors.displayOrder && (
                  <p className="mt-1 text-xs text-error-500">{errors.displayOrder}</p>
                )}
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
                <p className="text-xs text-gray-400">
                  Uploading new images will append to existing images on save.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={isOrdering}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isOrdering ? 'Saving Order...' : 'Save Order'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveImages}
                  disabled={saveStatus === 'saving'}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-500 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-600 shadow-theme-xs hover:bg-brand-500 hover:text-white dark:border-brand-400 dark:text-brand-300 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveStatus === 'saving' ? 'Saving Images...' : 'Save Images'}
                </button>
                <label className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] cursor-pointer">
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  Upload Images
                </label>
              </div>
            </div>

            <div className="mt-6">
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-xl border border-dashed p-6 text-center transition ${
                  isDragActive
                    ? 'border-brand-500 bg-brand-500/5'
                    : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                }`}
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="mt-1 text-xs text-gray-400">or click to browse</p>
              </div>
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
                    <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                      <label className="flex items-center gap-2">
                        Order
                        <input
                          type="number"
                          value={image.displayOrder}
                          onChange={(e) => handleOrderChange(image.id, e.target.value)}
                          className="h-7 w-16 rounded-md border border-gray-200 px-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        />
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetFeature(image.id)}
                          className="text-brand-500 hover:underline"
                        >
                          Set Featured
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="text-error-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
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
