'use client';

import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useRouter } from 'next/navigation';
import { getFaqs, getFaqCategories, toggleFaqStatus, deleteFaq, reorderFaqs } from '@/service/admin-faq.service';
import { Faq, FaqCategory } from '@/types/faq';
import toast from 'react-hot-toast';

export default function FaqList() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await getFaqs({ page, size: 20, category: categoryFilter || undefined });
      setFaqs(response.data.faqs);
    } catch (error: any) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catRes = await getFaqCategories();
        setCategories(catRes.data);
      } catch (e) {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [page, categoryFilter]);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleFaqStatus(id, !currentStatus);
      toast.success('Status updated');
      setFaqs(faqs.map(f => f.id === id ? { ...f, isActive: !currentStatus } : f));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await deleteFaq(id);
      toast.success('FAQ deleted');
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="FAQ Management" />
      <div className="space-y-6">
        <ComponentCard title="All FAQs" desc="Manage Frequently Asked Questions">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(0);
                }}
                className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => router.push('/admin/faq/create')}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Add FAQ
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Question</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No FAQs found.</td>
                    </tr>
                  ) : (
                    faqs.map((faq) => (
                      <tr key={faq.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-medium">{faq.displayOrder}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{faq.question}</div>
                          <div className="text-xs line-clamp-1 mt-1 text-gray-400">{faq.answer}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {faq.category.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={faq.isActive}
                              onChange={() => handleToggleStatus(faq.id, faq.isActive)}
                            />
                            <div className={`h-5 w-9 rounded-full transition-colors ${faq.isActive ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                            <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${faq.isActive ? 'translate-x-4' : ''}`}></div>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => router.push(`/admin/faq/${faq.id}/edit`)}
                            className="mr-3 font-medium text-brand-600 hover:underline dark:text-brand-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
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
