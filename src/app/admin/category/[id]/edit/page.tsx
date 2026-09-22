'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import CategoryForm from '@/app/admin/category/components/CategoryForm';
import api from '@/lib/axios';
import { Category, CategoryResponse } from '@/types/category';
import toast from 'react-hot-toast';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const idStr = params?.id as string;
  const categoryId = idStr ? parseInt(idStr, 10) : null;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categoryId) return;
      
      try {
        const response = await api.get<CategoryResponse>('/categories');
        const result = response.data;
        if (result.status === 200) {
          setCategories(result.data);
          const found = result.data.find(c => c.id === categoryId);
          if (found) {
            setEditingCategory(found);
          } else {
            toast.error('Category not found');
            router.push('/admin/category');
          }
        }
      } catch (error) {
        toast.error('Failed to load category data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryId, router]);

  const handleSuccess = () => {
    router.push('/admin/category');
  };

  const handleCancel = () => {
    router.push('/admin/category');
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Category" />
      <div className="space-y-6">
        <ComponentCard title="Edit Category" desc="Update the category information.">
          {loading ? (
            <p className="p-5 text-gray-500">Loading category data...</p>
          ) : editingCategory ? (
            <CategoryForm
              initialData={editingCategory}
              categories={categories}
              onSubmitSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : (
            <p className="p-5 text-error-500">Category not found.</p>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
