'use client';
import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Add from '@/app/admin/product/components/Add';
import { Category } from '@/types/category';

// Mock data - You can eventually replace these with a useEffect that fetches from your API
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Earrings',
    slug: 'earrings',
    description: '',
    logoUrl: '',
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
    createdAt: '',
    updatedAt: '',
    parent: null,
  },
];

const mockBrands = [
  { id: 1, name: 'Sumshine' },
  { id: 2, name: 'Pandora' },
  { id: 3, name: 'Swarovski' },
  { id: 4, name: 'Local Artisan' },
];

const AddProduct = () => {
  return (
    <div className="p-4 md:p-6">
      {/* 1. Breadcrumb navigation */}
      <PageBreadcrumb pageTitle="Add Product" />

      {/* 2. Main Form Container */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-7xl mx-auto mt-6">
        {/* We only pass the data. The 'Add' component handles its own
            submission, loading UI, and error messaging now.
        */}
        <Add categories={mockCategories} brands={mockBrands} />
      </div>
    </div>
  );
};

export default AddProduct;
