'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Product, PaginatedProductResponse } from '@/types/product-list';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ListProducts from '@/app/admin/product/components/ListProducts';
import Pagination from '@/components/tables/Pagination';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
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
          search: search,
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Product Management" />
      <div className="space-y-6">
        <ComponentCard title="All Products" hasButton={true} buttonText="Add Product">
          <div className="p-5 border-b border-gray-100 dark:border-white/[0.05]">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border rounded-lg dark:bg-white/[0.03] dark:border-white/[0.05]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            />
          </div>

          {loading ? (
            <p className="p-5">Loading products...</p>
          ) : (
            <>
              <ListProducts products={products} />

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
        </ComponentCard>
      </div>
    </div>
  );
}
