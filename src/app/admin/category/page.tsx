'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ListCategories from '@/app/admin/category/components/ListCategories';
import { Category, CategoryResponse } from '@/types/category';
import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import { authService } from '@/service/auth.service';
import api from '@/lib/axios';

export default function CategoryList() {
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
      } catch (error: any) {
        // Axios puts the error response from Spring Boot here:
        console.error('Failed to fetch:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Category Management" />
      <div className="space-y-6">
        <ComponentCard title="All Categories">
          {loading ? (
            <p className="p-5">Loading categories...</p>
          ) : (
            <ListCategories categories={categories} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
