'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/admin/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import ListStaticContent from './components/ListStaticContent';
import { ApiResponse, StaticContentItem } from '@/types/static-content';

export default function StaticContentPage() {
  const [items, setItems] = useState<StaticContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiResponse<StaticContentItem[]>>('/admin/static-content');
        if (!isMounted) {
          return;
        }
        setItems(response.data.data || []);
      } catch (error) {
        console.error('Failed to load static content', error);
        toast.error('Unable to load static content.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Static Content" />
      <ComponentCard
        title="Static Content Library"
        desc="Manage reusable website assets like hero media, banners, and other future static sections."
      >
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`static-content-skeleton-${index}`}
                className="h-14 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
              />
            ))}
          </div>
        ) : (
          <ListStaticContent items={items} />
        )}
      </ComponentCard>
    </div>
  );
}
