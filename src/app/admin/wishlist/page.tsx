'use client';
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { adminGetWishlist, adminGetWishlistStats } from '@/lib/api/adminWishlistApi';
import Icon from '@/components/ui/AppIcon';

export default function AdminWishlistPage() {
  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
    userId: '',
    productId: '',
    guestOnly: false,
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
  
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetWishlistStats().then(r => setStats(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    adminGetWishlist(filters)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  };

  const handleExportCSV = () => {
    if (!data?.items?.length) return;
    
    const headers = ['ID', 'User ID', 'User Email', 'Guest Token', 'Product ID', 'Product Name', 'Variant', 'Date Added'];
    const rows = data.items.map((item: any) => [
      item.id,
      item.userId || '',
      item.userEmail || '',
      item.guestToken || '',
      item.productId,
      item.productName,
      item.variantName || 'Default',
      new Date(item.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'wishlist_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Wishlist Management" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <ComponentCard title="Total Wishlist Items">
          <div className="text-3xl font-bold">{stats?.totalItems || 0}</div>
        </ComponentCard>
        <ComponentCard title="Registered Users">
          <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
        </ComponentCard>
        <ComponentCard title="Guest Sessions">
          <div className="text-3xl font-bold">{stats?.totalGuests || 0}</div>
        </ComponentCard>
        <ComponentCard title="Top Product">
          <div className="text-lg font-medium truncate">
            {stats?.topWishlistedProducts?.[0]?.productName || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {stats?.topWishlistedProducts?.[0]?.count ? `${stats.topWishlistedProducts[0].count} saves` : ''}
          </div>
        </ComponentCard>
      </div>

      <ComponentCard title="Wishlist Data">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1">User ID</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 text-sm dark:bg-gray-900 dark:border-gray-700" 
              placeholder="Filter by User ID"
              value={filters.userId}
              onChange={e => handleFilterChange('userId', e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1">Product ID</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 text-sm dark:bg-gray-900 dark:border-gray-700" 
              placeholder="Filter by Product ID"
              value={filters.productId}
              onChange={e => handleFilterChange('productId', e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm mb-1">From Date</label>
            <input 
              type="date" 
              className="w-full border rounded p-2 text-sm dark:bg-gray-900 dark:border-gray-700"
              value={filters.dateFrom}
              onChange={e => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm mb-1">To Date</label>
            <input 
              type="date" 
              className="w-full border rounded p-2 text-sm dark:bg-gray-900 dark:border-gray-700"
              value={filters.dateTo}
              onChange={e => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm mb-1">Sort By</label>
            <select 
              className="w-full border rounded p-2 text-sm dark:bg-gray-900 dark:border-gray-700"
              value={filters.sortBy}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="createdAt">Date Added</option>
              <option value="productName">Product Name</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm mb-1">Direction</label>
            <select 
              className="w-full border rounded p-2 text-sm dark:bg-gray-900 dark:border-gray-700"
              value={filters.sortDir}
              onChange={e => handleFilterChange('sortDir', e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <div className="flex items-center min-w-[150px] pt-5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-brand-500 focus:ring-brand-500"
                checked={filters.guestOnly}
                onChange={e => handleFilterChange('guestOnly', e.target.checked)}
              />
              <span className="text-sm">Guest Only</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {data?.items?.length || 0} of {data?.totalElements || 0} items
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 transition"
          >
            <Icon name="DownloadIcon" size={16} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No wishlist items found</td>
                </tr>
              ) : (
                data?.items?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.userEmail || <span className="text-gray-400 italic">Guest</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.variantName || 'Default'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Items per page:</span>
            <select 
              className="border rounded p-1 text-sm dark:bg-gray-900 dark:border-gray-700"
              value={filters.size}
              onChange={e => handleFilterChange('size', Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              disabled={filters.page === 0}
              onClick={() => handleFilterChange('page', filters.page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {filters.page + 1} of {data?.totalPages || 1}
            </span>
            <button 
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              disabled={filters.page >= (data?.totalPages || 1) - 1}
              onClick={() => handleFilterChange('page', filters.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
