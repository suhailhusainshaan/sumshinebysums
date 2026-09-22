'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import api from '@/lib/axios';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import toast from 'react-hot-toast';
import AppImage from '@/components/ui/AppImage';
import { resolveCategoryImageSrc } from '@/lib/category-image';
import axios from 'axios';

interface CategoryFormProps {
  initialData?: Category | null;
  categories: Category[];
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({
  initialData,
  categories,
  onSubmitSuccess,
  onCancel,
}: CategoryFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    parent: initialData?.parent ? String(initialData.parent) : '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initialData?.logoUrl ? resolveCategoryImageSrc(initialData.logoUrl) : null
  );

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || fallback;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallback;
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched
        ? prev.slug
        : value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
    }));
    if (errors.name || errors.submit) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        delete next.submit;
        return next;
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    setImagePreviewUrl((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return file
        ? URL.createObjectURL(file)
        : initialData?.logoUrl
          ? resolveCategoryImageSrc(initialData.logoUrl)
          : null;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.slug.trim()) nextErrors.slug = 'Slug is required';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setIsSaving(true);
    
    try {
      const multipartData = new FormData();
      multipartData.append('name', formData.name);
      multipartData.append('slug', formData.slug);
      multipartData.append('description', formData.description);
      if (formData.parent) {
        multipartData.append('parent', formData.parent);
      }
      if (selectedImage) {
        multipartData.append('image', selectedImage);
      }

      if (initialData) {
        const response = await api.put(`/admin/categories/${initialData.id}`, multipartData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data?.status === 200) {
          toast.success(response.data?.message || 'Category updated');
          onSubmitSuccess();
        }
      } else {
        const response = await api.post('/admin/categories', multipartData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data?.status === 200) {
          toast.success(response.data?.message || 'Category created');
          onSubmitSuccess();
        }
      }
    } catch (error: unknown) {
      setErrors({ submit: getErrorMessage(error, 'Unable to save category.') });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-500">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="category-name">Name *</Label>
          <Input
            id="category-name"
            name="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Bracelets"
          />
          {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
        </div>
        
        <div>
          <Label htmlFor="category-slug">Slug *</Label>
          <Input
            id="category-slug"
            name="slug"
            value={formData.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setFormData((prev) => ({ ...prev, slug: e.target.value }));
              if (errors.slug || errors.submit) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.slug;
                  delete next.submit;
                  return next;
                });
              }
            }}
            placeholder="bracelets"
          />
          {errors.slug && <p className="mt-1 text-xs text-error-500">{errors.slug}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="category-description">Description</Label>
        <TextArea
          id="category-description"
          name="description"
          value={formData.description}
          onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="category-image">Category Image</Label>
          <input
            id="category-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600 dark:border-gray-700 dark:text-white/90"
          />
          {imagePreviewUrl && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900 w-fit">
              <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                <AppImage
                  src={imagePreviewUrl}
                  alt={formData.name || 'Category preview'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="category-parent">Parent (optional)</Label>
          <select
            id="category-parent"
            value={formData.parent}
            onChange={(e) => setFormData((prev) => ({ ...prev, parent: e.target.value }))}
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">No parent</option>
            {categories
              .filter((category) => category.id !== initialData?.id)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
