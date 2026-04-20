'use client';
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Add from '@/app/admin/product/components/Add';
import { Category, CategoryResponse } from '@/types/category';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const mockBrands = [{ id: 1, name: 'Sumshine' }];

const AddProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<CategoryResponse>('/categories');
        if (response.data?.status === 200) {
          setCategories(response.data.data || []);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Unable to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-4 md:p-6">
      {/* 1. Breadcrumb navigation */}
      <PageBreadcrumb pageTitle="Add Product" />

      {/* 2. Main Form Container */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-7xl mx-auto mt-6">
        {/* We only pass the data. The 'Add' component handles its own
            submission, loading UI, and error messaging now.
        */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03]">
            Loading categories...
          </div>
        ) : (
          <Add categories={categories} brands={mockBrands} />
        )}
      </div>
    </div>
  );
};

export default AddProduct;
