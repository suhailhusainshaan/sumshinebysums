'use client';

import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useRouter } from 'next/navigation';
import { getAdminPages, toggleAdminPageStatus, deleteAdminPage } from '@/service/admin-page.service';
import { StaticPageSummary } from '@/types/page';
import toast from 'react-hot-toast';

export default function StaticPagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<StaticPageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await getAdminPages();
      setPages(response.data.pages);
    } catch (error: any) {
      toast.error('Failed to load static pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleAdminPageStatus(id, !currentStatus);
      toast.success('Status updated');
      setPages(pages.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this static page?')) return;
    try {
      await deleteAdminPage(id);
      toast.success('Page deleted');
      setPages(pages.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Static Pages" />
      <div className="space-y-6">
        <ComponentCard title="All Pages" desc="Manage static HTML pages (Privacy Policy, Terms, etc.)">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="text-sm text-gray-500">Total: {pages.length}</div>
            <button
              onClick={() => router.push('/admin/static-pages/create')}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Add Page
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No static pages found.</td>
                    </tr>
                  ) : (
                    pages.map((page) => (
                      <tr key={page.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {page.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            /{page.slug}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatDate(page.updatedAt)}</td>
                        <td className="px-4 py-3">
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={page.isActive}
                              onChange={() => handleToggleStatus(page.id, page.isActive)}
                            />
                            <div className={`h-5 w-9 rounded-full transition-colors ${page.isActive ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                            <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${page.isActive ? 'translate-x-4' : ''}`}></div>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => router.push(`/admin/static-pages/${page.id}/edit`)}
                            className="mr-3 font-medium text-brand-600 hover:underline dark:text-brand-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
