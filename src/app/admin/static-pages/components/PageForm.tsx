'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createAdminPage, updateAdminPage, getAdminPageById } from '@/service/admin-page.service';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import dynamic from 'next/dynamic';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p>Loading Editor...</p> });

interface PageFormProps {
  pageId?: number;
}

interface PageFormData {
  slug: string;
  title: string;
  content: string;
  isActive: boolean;
}

export default function PageForm({ pageId }: PageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!pageId);

  const [formData, setFormData] = useState<PageFormData>({
    slug: '',
    title: '',
    content: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRawHtml, setShowRawHtml] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'color',
    'background',
    'align',
    'link',
    'image',
    'video',
  ];

  useEffect(() => {
    const fetchInitData = async () => {
      if (!pageId) {
        setInitialLoading(false);
        return;
      }
      try {
        const pageRes = await getAdminPageById(pageId);
        const page = pageRes.data;
        setFormData({
          slug: page.slug,
          title: page.title,
          content: page.content || '',
          isActive: page.isActive,
        });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load form data');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitData();
  }, [pageId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const handleToggleView = () => {
    if (!showRawHtml) {
      // Clean up the HTML to make it readable in raw mode
      setFormData(prev => ({
        ...prev,
        content: prev.content
          .replace(/&nbsp;/g, ' ')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/<\/p>/g, '</p>\n')
          .replace(/<\/h([1-6])>/g, '</h$1>\n')
          .replace(/<ul>/g, '<ul>\n')
          .replace(/<\/ul>/g, '</ul>\n')
          .replace(/<li>/g, '  <li>')
          .replace(/<\/li>/g, '</li>\n')
          .replace(/<br>/g, '<br>\n')
      }));
    }
    setShowRawHtml(!showRawHtml);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.slug) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
    }
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (pageId) {
        await updateAdminPage(pageId, formData);
        toast.success('Page updated successfully');
      } else {
        await createAdminPage(formData);
        toast.success('Page created successfully');
      }
      router.push('/admin/static-pages');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-4 text-gray-500">Loading form data...</div>;

  return (
    <ComponentCard title={pageId ? 'Edit Static Page' : 'Create Static Page'}>
      <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Title *</Label>
            <Input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Privacy Policy" 
            />
            {errors.title && <span className="text-red-500 text-sm mt-1 block">{errors.title}</span>}
          </div>

          <div>
            <Label>Slug *</Label>
            <Input 
              type="text" 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. privacy-policy" 
            />
            {errors.slug && <span className="text-red-500 text-sm mt-1 block">{errors.slug}</span>}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Content *</Label>
            <button
              type="button"
              onClick={handleToggleView}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              {showRawHtml ? 'Show Visual Editor' : 'Edit Raw HTML'}
            </button>
          </div>
          
          <div className="mt-2 bg-white dark:bg-gray-900 border rounded-lg overflow-hidden border-gray-300 dark:border-gray-700">
            {showRawHtml ? (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full min-h-[300px] p-4 font-mono text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="<p>Enter raw HTML here...</p>"
              />
            ) : (
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
                className="text-gray-900 dark:text-white"
                style={{ minHeight: '300px' }}
              />
            )}
          </div>
          {errors.content && <span className="text-red-500 text-sm mt-1 block">{errors.content}</span>}
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <label className="relative flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="isActive"
              className="sr-only"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <div className={`h-6 w-11 rounded-full border border-gray-200 transition-colors ${formData.isActive ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700 dark:border-gray-700'}`}></div>
            <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-5' : ''}`}></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Active Status
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
          <button
            type="button"
            onClick={() => router.push('/admin/static-pages')}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : pageId ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
