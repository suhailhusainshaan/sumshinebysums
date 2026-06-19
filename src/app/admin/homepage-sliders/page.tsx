'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/admin/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import AppImage from '@/components/ui/AppImage';
import { resolveImageSrc } from '@/lib/image';
import { ApiResponse, HomepageSlider } from '@/types/homepage-slider';

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function extractData(value: unknown): unknown {
  const record = asRecord(value);
  return record && 'data' in record ? record.data : value;
}

function extractArray(value: unknown): unknown[] {
  const data = extractData(value);
  if (Array.isArray(data)) {
    return data;
  }

  const record = asRecord(data);
  if (record && Array.isArray(record.content)) {
    return record.content;
  }

  return [];
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function normalizeSlider(value: unknown): HomepageSlider {
  const record = asRecord(value) || {};
  return {
    id: asNumber(record.id) ?? 0,
    imageUrl: asString(record.imageUrl) ?? asString(record.url) ?? '',
    altText: asString(record.altText) ?? '',
    redirectUrl: asString(record.redirectUrl) ?? '',
    displayOrder: asNumber(record.displayOrder) ?? 0,
    isActive: asBoolean(record.isActive) ?? asBoolean(record.active) ?? true,
    createdAt: asString(record.createdAt),
    updatedAt: asString(record.updatedAt),
  };
}

export default function HomepageSlidersPage() {
  const [sliders, setSliders] = useState<HomepageSlider[]>([]);
  const [loading, setLoading] = useState(true);

  const sortedSliders = useMemo(
    () => [...sliders].sort((a, b) => a.displayOrder - b.displayOrder),
    [sliders]
  );

  const fetchSliders = async () => {
    try {
      const response = await api.get<ApiResponse<unknown>>('/admin/homepage/sliders');
      setSliders(extractArray(response.data).map(normalizeSlider));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to load homepage sliders.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleToggleStatus = async (slider: HomepageSlider) => {
    const nextStatus = !slider.isActive;
    try {
      const response = await api.patch<ApiResponse<unknown>>(
        `/admin/homepage/sliders/${slider.id}/status`,
        { isActive: nextStatus }
      );
      setSliders((prev) =>
        prev.map((item) => (item.id === slider.id ? { ...item, isActive: nextStatus } : item))
      );
      toast.success(
        asRecord(response.data)?.message ? String(asRecord(response.data)?.message) : 'Slider status updated.'
      );
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update slider status.'));
    }
  };

  const handleDelete = async (slider: HomepageSlider) => {
    const confirmed = window.confirm('Are you sure you want to delete this slider?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete<ApiResponse<null>>(`/admin/homepage/sliders/${slider.id}`);
      setSliders((prev) => prev.filter((item) => item.id !== slider.id));
      toast.success(response.data?.message || 'Slider deleted successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete slider.'));
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Homepage Sliders" />

      <ComponentCard
        title="Homepage Sliders"
        desc="Manage promotional banners displayed on the storefront homepage."
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total: {sliders.length}</p>
          <Link
            href="/admin/homepage-sliders/create"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-100"
          >
            Add Slider
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`homepage-slider-skeleton-${index}`}
                className="h-14 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
              />
            ))}
          </div>
        ) : sortedSliders.length ? (
          <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[980px]">
                <table className="w-full table-auto">
                  <thead className="border-b border-gray-100 bg-gray-50/70 dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <tr>
                      {[
                        'Preview',
                        'Alt Text',
                        'Redirect URL',
                        'Display Order',
                        'Status',
                        'Actions',
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {sortedSliders.map((slider) => (
                      <tr key={slider.id}>
                        <td className="px-5 py-4">
                          <div className="h-16 w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <AppImage
                              src={resolveImageSrc(slider.imageUrl)}
                              alt={slider.altText || 'Homepage slider'}
                              width={112}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <span className="block max-w-[220px] truncate">
                            {slider.altText || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="block max-w-[260px] truncate">
                            {slider.redirectUrl || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {slider.displayOrder}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(slider)}
                            className={`inline-flex min-w-[104px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium ${
                              slider.isActive
                                ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                            }`}
                          >
                            {slider.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/homepage-sliders/edit/${slider.id}`}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(slider)}
                              className="rounded-lg border border-error-200 px-3 py-2 text-xs font-medium text-error-600 hover:bg-error-50 dark:border-error-500/30 dark:hover:bg-error-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No homepage sliders found yet.
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
