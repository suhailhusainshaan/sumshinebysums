'use client';
import React, { useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Add from '@/app/admin/product/components/Add';
import { Category } from '@/types/category';

// Mock data - replace with actual API calls
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Earrings',
    slug: 'earrings',
    description: '',
    logoUrl: '',
    active: false,
    createdAt: '',
    updatedAt: '',
    parent: null,
  },
  {
    id: 2,
    name: 'Necklaces',
    slug: 'necklaces',
    description: '',
    logoUrl: '',
    active: false,
    createdAt: '',
    updatedAt: '',
    parent: null,
  },
  {
    id: 3,
    name: 'Rings',
    slug: 'rings',
    description: '',
    logoUrl: '',
    active: false,
    createdAt: '',
    updatedAt: '',
    parent: null,
  },
  {
    id: 4,
    name: 'Bracelets',
    slug: 'bracelets',
    description: '',
    logoUrl: '',
    active: false,
    createdAt: '',
    updatedAt: '',
    parent: null,
  },
];

const mockBrands = [
  { id: 1, name: 'Tiffany & Co.' },
  { id: 2, name: 'Pandora' },
  { id: 3, name: 'Swarovski' },
  { id: 4, name: 'Local Artisan' },
];

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Here you would make your API call
      console.log('Submitting product:', formData);

      // Example API call:
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // if (!response.ok) throw new Error('Failed to add product');

      // Handle success (redirect, show success message, etc.)
      alert('Product added successfully!');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Product" />

      {submitError && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 text-error-700 rounded-lg">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 w-full max-w-7xl mx-auto">
        <Add categories={mockCategories} brands={mockBrands} onSubmit={handleSubmit} />
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Adding product...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
