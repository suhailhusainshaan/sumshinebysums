'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/badge/Badge';
import AppImage from '@/components/ui/AppImage';
import { StaticContentItem } from '@/types/static-content';

interface ListStaticContentProps {
  items: StaticContentItem[];
}

const formatDate = (value: string | null) => {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleString();
};

export default function ListStaticContent({ items }: ListStaticContentProps) {
  const router = useRouter();
  const getPreviewUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_IMG_URL || ''}${url}`;
  };

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No static content found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[980px]">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-100 bg-gray-50/70 dark:border-white/[0.05] dark:bg-white/[0.02]">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Content
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Type
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Preview
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center dark:text-gray-400">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  onClick={() => router.push(`/admin/static-content/${item.id}`)}
                >
                  <td className="px-5 py-4 sm:px-6 text-start">
                    <div className="space-y-1">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.key}
                      </span>
                      <span className="block max-w-[360px] truncate text-gray-500 text-theme-xs">
                        {item.altText || item.url}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-300">
                    {item.type || 'image'}
                  </td>
                  <td className="px-5 py-4 text-start">
                    <div className="h-14 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <AppImage
                        src={getPreviewUrl(item.url)}
                        alt={item.altText || item.key}
                        width={80}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge size="sm" color={item.isActive ? 'success' : 'light'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-start text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
