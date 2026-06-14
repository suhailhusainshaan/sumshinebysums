'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/admin/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Select from '@/components/admin/form/Select';
import TextArea from '@/components/admin/form/input/TextArea';
import Button from '@/components/admin/ui/button/Button';
import AppImage from '@/components/ui/AppImage';
import { ApiResponse, StaticContentItem } from '@/types/static-content';
import { resolveImageSrc } from '@/lib/image';

interface FormState {
  key: string;
  type: string;
  altText: string;
  metadata: string;
  isActive: boolean;
}

const TYPE_OPTIONS = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'icon', label: 'Icon' },
];

export default function EditStaticContentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const itemId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [formData, setFormData] = useState<FormState>({
    key: '',
    type: 'image',
    altText: '',
    metadata: '{\n  "section": "homepage"\n}',
    isActive: true,
  });

  useEffect(() => {
    if (!itemId) {
      return;
    }

    let isMounted = true;

    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiResponse<StaticContentItem>>(
          `/admin/static-content/${itemId}`
        );
        if (!isMounted) {
          return;
        }

        const item = response.data.data;
        setFormData({
          key: item.key || '',
          type: item.type || 'image',
          altText: item.altText || '',
          metadata: JSON.stringify(item.metadata || {}, null, 2),
          isActive: Boolean(item.isActive),
        });
        setCurrentImageUrl(resolveImageSrc(item.url));
      } catch (error) {
        console.error('Failed to load static content item', error);
        toast.error('Unable to load static content item.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItem();
    return () => {
      isMounted = false;
    };
  }, [itemId]);

  const metadataPreview = useMemo(() => {
    try {
      return JSON.parse(formData.metadata || '{}');
    } catch {
      return null;
    }
  }, [formData.metadata]);

  const previewImageUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return currentImageUrl;
  }, [currentImageUrl, imageFile]);

  useEffect(() => {
    return () => {
      if (previewImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.key.trim()) {
      nextErrors.key = 'Key is required';
    }
    if (!currentImageUrl && !imageFile) {
      nextErrors.image = 'Image is required';
    }
    try {
      JSON.parse(formData.metadata || '{}');
    } catch {
      nextErrors.metadata = 'Metadata must be valid JSON';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!itemId || !validate()) {
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append(
        'request',
        new Blob(
          [
            JSON.stringify({
              key: formData.key.trim(),
              type: formData.type,
              altText: formData.altText.trim(),
              metadata: JSON.parse(formData.metadata || '{}'),
              isActive: formData.isActive,
            }),
          ],
          { type: 'application/json' }
        )
      );

      if (imageFile) {
        payload.append('image', imageFile);
      }

      await api.put(`/admin/static-content/${itemId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const refreshed = await api.get<ApiResponse<StaticContentItem>>(
        `/admin/static-content/${itemId}`
      );
      const item = refreshed.data.data;
      setCurrentImageUrl(resolveImageSrc(item.url));
      setImageFile(null);
      setFormData({
        key: item.key || '',
        type: item.type || 'image',
        altText: item.altText || '',
        metadata: JSON.stringify(item.metadata || {}, null, 2),
        isActive: Boolean(item.isActive),
      });
      toast.success('Static content updated.');
      router.refresh();
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      console.error('Failed to update static content', error);
      toast.error(message || 'Unable to update static content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Edit Static Content"
        crumbs={[{ label: 'Static Content', href: '/admin/static-content' }]}
      />

      {loading ? (
        <ComponentCard title="Loading static content">
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`static-content-edit-skeleton-${index}`}
                className="h-12 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
              />
            ))}
          </div>
        </ComponentCard>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <ComponentCard
            title="Static Content Details"
            desc="Keep this item generic so same section can manage more homepage and marketing assets later."
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="key">Content Key</Label>
                <input
                  id="key"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 ${
                    errors.key
                      ? 'border-error-500 focus:ring-error-500/10'
                      : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700'
                  } dark:bg-gray-900 dark:text-white/90`}
                />
                {errors.key ? <p className="mt-1.5 text-xs text-error-500">{errors.key}</p> : null}
              </div>
              <div>
                <Label htmlFor="type">Content Type</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  options={TYPE_OPTIONS}
                  onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="altText">Alt Text</Label>
                <TextArea
                  id="altText"
                  name="altText"
                  rows={3}
                  value={formData.altText}
                  onChange={(value) => setFormData((prev) => ({ ...prev, altText: value }))}
                />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Image Section"
            desc="This section controls hero background image today, and can hold more media settings later."
          >
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 shadow-theme-xs file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  />
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Save writes image in `uploads/slider`. Replacing image deletes old file.
                  </p>
                  {errors.image ? (
                    <p className="mt-1.5 text-xs text-error-500">{errors.image}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="metadata">Metadata JSON</Label>
                  <TextArea
                    id="metadata"
                    name="metadata"
                    rows={12}
                    value={formData.metadata}
                    onChange={(value) => setFormData((prev) => ({ ...prev, metadata: value }))}
                    error={!!errors.metadata}
                    hint={errors.metadata}
                  />
                </div>
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  Active on storefront
                </label>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <div className="aspect-[4/5] w-full">
                    {previewImageUrl ? (
                      <AppImage
                        src={previewImageUrl}
                        alt={formData.altText || formData.key}
                        fill
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        No image selected
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-900">
                  <p className="font-medium text-gray-800 dark:text-white/90">Live Preview</p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Homepage hero will use this image for key <code>{formData.key}</code>.
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Source: {imageFile ? imageFile.name : 'Current stored image'}
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {metadataPreview ? JSON.stringify(metadataPreview, null, 2) : 'Invalid JSON'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/static-content')}
                buttonAction=""
              >
                Back
              </Button>
              <Button type="submit" buttonAction="" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </ComponentCard>
        </form>
      )}
    </div>
  );
}
