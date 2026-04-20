'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ListCategories from '@/app/admin/category/components/ListCategories';
import { Category, CategoryResponse } from '@/types/category';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<CategoryResponse>('/categories');

        const result = response.data;
        if (result.status === 200) {
          setCategories(result.data);
        }
      } catch (error: any) {
        // Axios puts the error response from Spring Boot here:
        console.error('Failed to fetch:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', parent: '' });
    setSlugTouched(false);
    setErrors({});
    setIsOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      parent: category.parent ? String(category.parent) : '',
    });
    setSlugTouched(true);
    setErrors({});
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingCategory(null);
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
      if (editingCategory) {
        const response = await api.put(`/admin/categories/${editingCategory.id}`, {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });
        if (response.data?.status === 200) {
          setCategories((prev) =>
            prev.map((item) => (item.id === editingCategory.id ? response.data.data : item))
          );
          toast.success(response.data?.message || 'Category updated');
        }
      } else {
        const response = await api.post('/admin/categories', {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          parent: formData.parent ? Number(formData.parent) : null,
        });
        if (response.data?.status === 200) {
          setCategories((prev) => [response.data.data, ...prev]);
          toast.success(response.data?.message || 'Category created');
        }
      }
      closeModal();
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Unable to save category.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    const ok = window.confirm('Are you sure you want to delete this category?');
    if (!ok) return;
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      if (response.data?.status === 200) {
        setCategories((prev) => prev.filter((category) => category.id !== categoryId));
        toast.success(response.data?.message || 'Category deleted');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete category.');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Category Management" />
      <div className="space-y-6">
        <ComponentCard title="All Categories" desc="Manage product categories">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-500">Total: {categories.length}</div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-100"
            >
              Add Category
            </button>
          </div>
          {loading ? (
            <p className="p-5">Loading categories...</p>
          ) : (
            <ListCategories
              categories={categories}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </ComponentCard>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[620px] p-6 lg:p-10">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <p className="text-sm text-gray-500">
              {editingCategory
                ? 'Update the category information.'
                : 'Add a new category to the catalog.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-500">
                {errors.submit}
              </div>
            )}
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
            <div>
              <Label htmlFor="category-description">Description</Label>
              <TextArea
                id="category-description"
                name="description"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              />
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
                  .filter((category) => category.id !== editingCategory?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
