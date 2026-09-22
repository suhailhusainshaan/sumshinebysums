'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import CategoryForm from '@/app/admin/category/components/CategoryForm';
import api from '@/lib/axios';
import { Category, CategoryResponse } from '@/types/category';
import toast from 'react-hot-toast';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<CategoryResponse>('/categories');
        const result = response.data;
        if (result.status === 200) {
          setCategories(result.data);
        }
      } catch (error) {
        toast.error('Failed to load categories for parent selection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSuccess = () => {
    router.push('/admin/category');
  };

  const handleCancel = () => {
    router.push('/admin/category');
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create Category" />
      <div className="space-y-6">
        <ComponentCard title="New Category" desc="Add a new category to the catalog.">
          {loading ? (
            <p className="p-5 text-gray-500">Loading...</p>
          ) : (
            <CategoryForm
              categories={categories}
              onSubmitSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
