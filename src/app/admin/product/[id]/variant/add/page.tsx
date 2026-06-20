'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface FormState {
  name: string;
  sku: string;
  description: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  stockQuantity: string;
  displayOrder: string;
  weight: string;
  dimensions: {
    unit: string;
    length: string;
    width: string;
    height: string;
  };
  active: boolean;
}

export default function AddVariantPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormState>({
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
      length: '',
      width: '',
      height: '',
    },
    active: true,
  });

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

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Variant name is required';
    if (!formData.sku.trim()) nextErrors.sku = 'SKU is required';
    if (!formData.price) {
      nextErrors.price = 'Price is required';
    } else if (Number(formData.price) <= 0) {
      nextErrors.price = 'Price must be greater than 0';
    }
    if (formData.compareAtPrice && Number(formData.compareAtPrice) < 0) {
      nextErrors.compareAtPrice = 'Compare at price must be >= 0';
    }
    if (formData.costPrice && Number(formData.costPrice) < 0) {
      nextErrors.costPrice = 'Cost price must be >= 0';
    }
    if (formData.stockQuantity && Number(formData.stockQuantity) < 0) {
      nextErrors.stockQuantity = 'Stock cannot be negative';
    }
    if (formData.displayOrder && Number.isNaN(Number(formData.displayOrder))) {
      nextErrors.displayOrder = 'Display order must be a number';
    }
    if (formData.weight && Number(formData.weight) < 0) {
      nextErrors.weight = 'Weight must be >= 0';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    if (!validateForm()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        costPrice: formData.costPrice ? Number(formData.costPrice) : null,
        stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : null,
        displayOrder: formData.displayOrder ? Number(formData.displayOrder) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        dimensionsJson: {
          unit: formData.dimensions.unit,
          length: formData.dimensions.length,
          width: formData.dimensions.width,
          height: formData.dimensions.height,
        },
        active: formData.active,
      };

      const response = await api.post(
        `/admin/product/variants/products/${productId}`,
        payload
      );

      if (response.data?.status === 200 || response.data?.data) {
        toast.success(response.data?.message || 'Variant added successfully.');
        const newVariantId = response.data?.data?.id;
        if (newVariantId) {
          router.push(`/admin/product/variant/${newVariantId}/edit`);
        } else {
          router.push(`/admin/product/${productId}/edit`);
        }
      } else {
        toast.error(response.data?.message || 'Failed to add variant.');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Unable to add variant. Please try again.';
      toast.error(msg);
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb
        pageTitle="Add Variant"
        crumbs={[
          { label: 'Product Management', href: '/admin/product' },
          { label: 'Edit Product', href: `/admin/product/${productId}/edit` },
        ]}
      />

      <div className="space-y-6 mt-6">
        <form onSubmit={handleSubmit}>
          <ComponentCard title="New Variant" desc="Fill in the details to add a new variant to this product">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Variant Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Red - Large"
                  error={!!errors.name}
                  hint={errors.name}
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. PROD-RED-L"
                  error={!!errors.sku}
                  hint={errors.sku}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Optional variant description"
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  error={!!errors.price}
                  hint={errors.price}
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
                  placeholder="0.00"
                  error={!!errors.compareAtPrice}
                  hint={errors.compareAtPrice}
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
                  placeholder="0.00"
                  error={!!errors.costPrice}
                  hint={errors.costPrice}
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
                  placeholder="0"
                  error={!!errors.stockQuantity}
                  hint={errors.stockQuantity}
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
                  placeholder="0"
                  error={!!errors.displayOrder}
                  hint={errors.displayOrder}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  error={!!errors.weight}
                  hint={errors.weight}
                />
              </div>

              <div>
                <Label htmlFor="dimensions.length">Length</Label>
                <Input
                  id="dimensions.length"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="dimensions.width">Width</Label>
                <Input
                  id="dimensions.width"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="dimensions.height">Height</Label>
                <Input
                  id="dimensions.height"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleChange}
                  placeholder="0"
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

            <div className="mt-8 flex flex-wrap justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push(`/admin/product/${productId}/edit`)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-brand-500 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Adding...' : 'Add Variant'}
              </button>
            </div>
          </ComponentCard>
        </form>
      </div>
    </div>
  );
}
