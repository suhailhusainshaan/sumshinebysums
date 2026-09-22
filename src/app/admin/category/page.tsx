'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ListCategories from '@/app/admin/category/components/ListCategories';
import { Category, CategoryResponse } from '@/types/category';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CategoryList() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || fallback;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallback;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<CategoryResponse>('/categories');
        const result = response.data;
        if (result.status === 200) {
          setCategories(result.data);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch:', getErrorMessage(error, 'Unable to load categories.'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    router.push(`/admin/category/${category.id}/edit`);
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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Unable to delete category.'));
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Category Management" />
      <div className="space-y-6">
        <ComponentCard title="All Categories" desc="Manage product categories">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="text-sm text-gray-500">Total: {categories.length}</div>
            <button
              type="button"
              onClick={() => router.push('/admin/category/create')}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-100"
            >
              Add Category
            </button>
          </div>
          {loading ? (
            <p className="p-5 text-gray-500">Loading categories...</p>
          ) : (
            <ListCategories categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
