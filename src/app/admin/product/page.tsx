'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Product, PaginatedProductResponse } from '@/types/product-list';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ListProducts from '@/app/admin/product/components/ListProducts';
import Pagination from '@/components/tables/Pagination';
import Button from '@/components/ui/button/Button';
import toast from 'react-hot-toast';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products/list', {
        params: {
          page: currentPage,
          size: 10,
          searchTerm: search,
        },
      });
      setProducts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Are you sure you want to delete this product?');
    if (!ok) return;
    try {
      const response = await api.delete(`/admin/products/${id}`);
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Product deleted');
        fetchProducts();
      } else {
        toast.error(response.data?.message || 'Unable to delete product');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete product');
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await api.patch(`/admin/products/${id}/featured`, { isFeatured });
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Featured status updated');
        setProducts((prev) =>
          prev.map((p) => (p.id.toString() === id ? { ...p, featured: isFeatured } : p))
        );
      } else {
        toast.error(response.data?.message || 'Unable to update featured status');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update featured status');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await api.patch(`/admin/products/${id}/active`, { isActive });
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Active status updated');
        setProducts((prev) =>
          prev.map((p) => (p.id.toString() === id ? { ...p, active: isActive } : p))
        );
      } else {
        toast.error(response.data?.message || 'Unable to update active status');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update active status');
    }
  };

  const handleTogglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await api.patch(`/admin/products/${id}/published`, { isPublished });
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Published status updated');
        setProducts((prev) =>
          prev.map((p) => (p.id.toString() === id ? { ...p, published: isPublished } : p))
        );
      } else {
        toast.error(response.data?.message || 'Unable to update published status');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update published status');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Product Management" />
      <div className="space-y-6">
        <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
        >
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/70 dark:border-gray-800/70 dark:bg-white/[0.02]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Catalog
                </p>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  All Products
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your product inventory and updates.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="h-10 w-full min-w-[220px] rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  buttonAction="/admin/product/add"
                  className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-100"
                >
                  Add Product
                </Button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-row-${index}`}
                      className="h-12 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <ListProducts products={products} onDelete={handleDelete} onToggleFeatured={handleToggleFeatured} onToggleActive={handleToggleActive} onTogglePublished={handleTogglePublished} />

                  {/* Simple Pagination Footer */}
                  <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
