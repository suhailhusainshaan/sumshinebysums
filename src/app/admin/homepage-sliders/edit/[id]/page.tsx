'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/admin/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import { resolveImageSrc } from '@/lib/image';
import { ApiResponse, HomepageSlider } from '@/types/homepage-slider';

interface SliderFormState {
  redirectUrl: string;
  altText: string;
  displayOrder: string;
  isActive: boolean;
  image: File | null;
}

const DEFAULT_FORM: SliderFormState = {
  redirectUrl: '',
  altText: '',
  displayOrder: '0',
  isActive: true,
  image: null,
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
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

export default function EditHomepageSliderPage() {
  const router = useRouter();
  const params = useParams();
  const sliderId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SliderFormState>(DEFAULT_FORM);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sliderId) return;

    const fetchSlider = async () => {
      try {
        const response = await api.get<ApiResponse<unknown>>('/admin/homepage/sliders');
        const sliders = extractArray(response.data) as any[];
        
        const slider = sliders.find((s) => Number(s.id) === sliderId);
        if (!slider) {
          toast.error('Slider not found');
          router.push('/admin/homepage-sliders');
          return;
        }

        const imageUrl = slider.imageUrl || slider.url || '';

        setFormData({
          redirectUrl: slider.redirectUrl || '',
          altText: slider.altText || '',
          displayOrder: String(slider.displayOrder ?? 0),
          isActive: slider.isActive ?? slider.active ?? true,
          image: null,
        });
        setOriginalImageUrl(imageUrl);
        setPreviewUrl(resolveImageSrc(imageUrl));
      } catch (error) {
        toast.error('Failed to load slider data');
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, [sliderId, router]);

  const updateForm = (patch: Partial<SliderFormState>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      delete next.submit;
      return next;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateForm({ image: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      updateForm({ image: null });
      setPreviewUrl(resolveImageSrc(originalImageUrl));
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const displayOrder = Number(formData.displayOrder);

    if (formData.redirectUrl.length > 1000) {
      nextErrors.redirectUrl = 'Redirect URL must be 1000 characters or fewer';
    }

    if (
      !formData.displayOrder.trim() ||
      !Number.isFinite(displayOrder) ||
      displayOrder < 0 ||
      !Number.isInteger(displayOrder)
    ) {
      nextErrors.displayOrder = 'Display order must be 0 or greater';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      const requestData = {
        redirectUrl: formData.redirectUrl.trim(),
        altText: formData.altText.trim(),
        displayOrder: Number(formData.displayOrder),
        isActive: formData.isActive,
      };

      payload.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
      if (formData.image) {
        payload.append('image', formData.image);
      }

      const response = await api.put<ApiResponse<HomepageSlider>>(`/admin/homepage/sliders/${sliderId}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data?.message || 'Slider updated successfully.');
      router.push('/admin/homepage-sliders');
    } catch (error) {
      let message = 'Unable to update slider.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Homepage Slider" />
        <ComponentCard title="Loading...">
          <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
        </ComponentCard>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Homepage Slider" />

      <ComponentCard title="Edit Slider" desc="Update details or replace the slider image.">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          {errors.submit && (
            <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-500">
              {errors.submit}
            </div>
          )}

          <div>
            <Label htmlFor="image">Slider Image (Optional - upload to replace)</Label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-500/10 dark:file:text-brand-400 dark:text-gray-400"
            />
            {errors.image && <p className="mt-1 text-sm text-error-500">{errors.image}</p>}
          </div>

          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 mt-4">
              <div className="relative aspect-[16/7] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                name="altText"
                value={formData.altText}
                onChange={(event) => updateForm({ altText: event.target.value })}
                placeholder="E.g., Summer Collection"
                error={Boolean(errors.altText)}
                hint={errors.altText}
              />
            </div>
            <div>
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                name="redirectUrl"
                value={formData.redirectUrl}
                onChange={(event) => updateForm({ redirectUrl: event.target.value })}
                placeholder="/collections/summer"
                error={Boolean(errors.redirectUrl)}
                hint={errors.redirectUrl || `${formData.redirectUrl.length}/1000 characters`}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min="0"
              step="1"
              value={formData.displayOrder}
              onChange={(event) => updateForm({ displayOrder: event.target.value })}
              error={Boolean(errors.displayOrder)}
              hint={errors.displayOrder}
              className="max-w-[180px]"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300 w-fit">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(event) => updateForm({ isActive: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            Active
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Link
              href="/admin/homepage-sliders"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Updating...' : 'Update Slider'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
