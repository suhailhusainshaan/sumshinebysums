'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import Select from '@/components/admin/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Badge from '@/components/ui/badge/Badge';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Category } from '@/types/category';

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
}

interface ProductResponse {
  data: {
    id: number;
    name: string;
    slug: string;
    description: string;
    published: boolean;
    displayOrder: number | null;
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

interface CategoryResponse {
  data: Category[];
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  published: boolean;
  displayOrder: string;
  features: {
    material: string;
    finish: string;
    hypoallergenic: boolean;
  };
  specifications: {
    material: string;
    purity: string;
    stone_type: string;
    hypoallergenic: boolean;
  };
}

const FALLBACK_IMAGE = '/images/fallbacks/no_product.jpg';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormState>({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    brandId: '1',
    published: false,
    displayOrder: '',
    features: {
      material: '',
      finish: '',
      hypoallergenic: false,
    },
    specifications: {
      material: '',
      purity: '',
      stone_type: '',
      hypoallergenic: false,
    },
  });

  const brandOptions = useMemo(() => [{ value: '1', label: 'Sumshine' }], []);

  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [variants]);

  const storeVariantForEdit = (variant: Variant) => {
    try {
      sessionStorage.setItem(
        `variant:${variant.id}`,
        JSON.stringify({
          ...variant,
          images: variant.images || [],
        })
      );
    } catch (error) {
      console.warn('Unable to store variant locally', error);
    }
  };

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timer = setTimeout(() => setSaveStatus('idle'), 2500);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get<ProductResponse>(`/admin/products/${productId}`),
          api.get<CategoryResponse>('/categories'),
        ]);

        if (!isMounted) return;

        const product = productRes.data.data;
        setCategories(categoryRes.data.data || []);
        setVariants(product.variants || []);
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          categoryId: product.category?.id ? String(product.category.id) : '',
          brandId: product.brand?.id ? String(product.brand.id) : '1',
          published: Boolean(product.published),
          displayOrder: product.displayOrder !== null ? String(product.displayOrder) : '',
          features: {
            material: product.features?.material || '',
            finish: product.features?.finish || '',
            hypoallergenic: Boolean(product.features?.hypoallergenic),
          },
          specifications: {
            material: product.specifications?.material || '',
            purity: product.specifications?.purity || '',
            stone_type: product.specifications?.stone_type || '',
            hypoallergenic: Boolean(product.specifications?.hypoallergenic),
          },
        });
      } catch (error) {
        console.error('Failed to load product details', error);
        toast.error('Unable to load product details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const nextValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormState] as object),
          [child]: nextValue,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: nextValue }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (saveStatus === 'saved') {
      setSaveStatus('idle');
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Product name is required';
    if (!formData.categoryId) nextErrors.categoryId = 'Select a category';
    if (!formData.slug.trim()) nextErrors.slug = 'Slug is required';
    if (!formData.description.trim()) nextErrors.description = 'Description is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (!validateForm() || !productId) return;

    setSaving(true);
    setSaveStatus('saving');
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        brandId: Number(formData.brandId || 1),
        categoryId: Number(formData.categoryId),
        published: formData.published,
        displayOrder: formData.displayOrder ? Number(formData.displayOrder) : null,
        features: {
          material: formData.features.material,
          finish: formData.features.finish,
          hypoallergenic: formData.features.hypoallergenic,
        },
        specifications: {
          material: formData.specifications.material,
          purity: formData.specifications.purity,
          stone_type: formData.specifications.stone_type,
          hypoallergenic: formData.specifications.hypoallergenic,
        },
      };

      await api.put(`/admin/products/${productId}`, payload);
      toast.success('Product updated successfully!');
      setSaveStatus('saved');
      router.refresh();
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const message = error?.response?.data?.message || 'Update failed. Please try again.';
        setErrors({ global: message });
        toast.error(message);
      }
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
  };

  const getVariantImage = (variant: Variant) => {
    if (!variant?.images || variant.images.length === 0) return FALLBACK_IMAGE;
    const sortedImages = [...variant.images].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );
    const image = sortedImages[0];
    if (!image?.imageUrl) return FALLBACK_IMAGE;
    return `${process.env.NEXT_PUBLIC_IMG_URL || ''}${image.imageUrl}`;
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb
        pageTitle="Edit Product"
        crumbs={[{ label: 'Product Management', href: '/admin/product' }]}
      />

      <div className="space-y-6 mt-6">
        <ComponentCard title="Variants" desc="Click a variant to edit its details">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`variant-skeleton-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
                >
                  <div className="h-40 w-full rounded-lg bg-gray-100 dark:bg-white/[0.05]" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-white/[0.05]" />
                    <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-white/[0.05]" />
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedVariants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No variants found for this product yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedVariants.map((variant) => (
                <Link
                  key={variant.id}
                  href={`/admin/product/variant/${variant.id}/edit`}
                  onClick={() => storeVariantForEdit(variant)}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={getVariantImage(variant)}
                      alt={variant.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        {variant.name}
                      </h4>
                      <Badge size="sm" color={variant.active ? 'success' : 'warning'}>
                        {variant.active ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Price: {variant.price ?? '—'}</span>
                      <span>Order: {variant.displayOrder ?? 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ComponentCard>

        <form onSubmit={handleSubmit}>
          <ComponentCard title="Product Details" desc="Update the main product fields">
            {errors.global && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {errors.global}
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Changes saved successfully.
              </div>
            )}

            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-6 w-40 rounded bg-gray-100 dark:bg-white/[0.05]" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`form-skel-${index}`}
                      className="h-12 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                    />
                  ))}
                </div>
                <div className="h-28 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={`form-skel-block-${index}`}
                      className="h-32 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        hint={errors.name}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        error={!!errors.slug}
                        hint={errors.slug}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <TextArea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(value) =>
                          setFormData((prev) => ({ ...prev, description: value }))
                        }
                        error={!!errors.description}
                        hint={errors.description}
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryId">Category *</Label>
                      <Select
                        key={`category-${formData.categoryId}`}
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        defaultValue={formData.categoryId}
                        options={categories.map((category) => ({
                          value: String(category.id),
                          label: category.name,
                        }))}
                        onChange={(value) =>
                          setFormData((prev) => ({ ...prev, categoryId: value }))
                        }
                        error={!!errors.categoryId}
                        hint={errors.categoryId}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brandId">Brand</Label>
                      <Select
                        key={`brand-${formData.brandId}`}
                        id="brandId"
                        name="brandId"
                        value={formData.brandId}
                        defaultValue={formData.brandId}
                        options={brandOptions}
                        onChange={(value) => setFormData((prev) => ({ ...prev, brandId: value }))}
                      />
                    </div>
                  </div>
                </div>

              <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold">Visibility & Ordering</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-7">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500"
                    />
                    <Label htmlFor="published" className="mb-0">
                      Published
                    </Label>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold">Features</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div>
                    <Label htmlFor="features.material">Material</Label>
                    <Input
                      id="features.material"
                      name="features.material"
                      value={formData.features.material}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features.finish">Finish</Label>
                    <Input
                      id="features.finish"
                      name="features.finish"
                      value={formData.features.finish}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-7">
                    <input
                      type="checkbox"
                      id="features.hypoallergenic"
                      name="features.hypoallergenic"
                      checked={formData.features.hypoallergenic}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500"
                    />
                    <Label htmlFor="features.hypoallergenic" className="mb-0">
                      Hypoallergenic
                    </Label>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold">Specifications</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div>
                    <Label htmlFor="specifications.material">Material</Label>
                    <Input
                      id="specifications.material"
                      name="specifications.material"
                      value={formData.specifications.material}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specifications.purity">Purity</Label>
                    <Input
                      id="specifications.purity"
                      name="specifications.purity"
                      value={formData.specifications.purity}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specifications.stone_type">Stone Type</Label>
                    <Input
                      id="specifications.stone_type"
                      name="specifications.stone_type"
                      value={formData.specifications.stone_type}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-7">
                    <input
                      type="checkbox"
                      id="specifications.hypoallergenic"
                      name="specifications.hypoallergenic"
                      checked={formData.specifications.hypoallergenic}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500"
                    />
                    <Label htmlFor="specifications.hypoallergenic" className="mb-0">
                      Hypoallergenic
                    </Label>
                  </div>
                </div>
              </div>

                <div className="flex flex-wrap justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saveStatus === 'saved' ? 'Saved' : saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </ComponentCard>
        </form>
      </div>
    </div>
  );
}
