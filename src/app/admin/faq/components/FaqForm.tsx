'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getFaqCategories, createFaq, updateFaq, getFaqById } from '@/service/admin-faq.service';
import { FaqCategory } from '@/types/faq';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';

interface FaqFormProps {
  faqId?: number;
}

interface FaqFormData {
  categorySlug: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export default function FaqForm({ faqId }: FaqFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!faqId);

  const [formData, setFormData] = useState<FaqFormData>({
    categorySlug: '',
    question: '',
    answer: '',
    displayOrder: 1,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const catRes = await getFaqCategories();
        setCategories(catRes.data || []);

        if (faqId) {
          const faqRes = await getFaqById(faqId);
          const faq = faqRes.data;
          setFormData({
            categorySlug: faq.category?.slug || '',
            question: faq.question,
            answer: faq.answer,
            displayOrder: faq.displayOrder,
            isActive: faq.isActive,
          });
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load form data');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitData();
  }, [faqId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categorySlug) newErrors.categorySlug = 'Category is required';
    if (!formData.question) newErrors.question = 'Question is required';
    if (!formData.answer) newErrors.answer = 'Answer is required';
    if (formData.displayOrder < 1) newErrors.displayOrder = 'Display order must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (faqId) {
        await updateFaq(faqId, formData);
        toast.success('FAQ updated successfully');
      } else {
        await createFaq(formData);
        toast.success('FAQ created successfully');
      }
      router.push('/admin/faq');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-4 text-gray-500">Loading form data...</div>;

  return (
    <ComponentCard title={faqId ? 'Edit FAQ' : 'Create FAQ'}>
      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
        
        <div>
          <Label>Category *</Label>
          <select
            name="categorySlug"
            value={formData.categorySlug}
            onChange={handleChange}
            className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.categorySlug && <span className="text-red-500 text-sm mt-1 block">{errors.categorySlug}</span>}
        </div>

        <div>
          <Label>Question *</Label>
          <Input 
            type="text" 
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="e.g. What are your shipping options?" 
          />
          {errors.question && <span className="text-red-500 text-sm mt-1 block">{errors.question}</span>}
        </div>

        <div>
          <Label>Answer *</Label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed answer text..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          />
          {errors.answer && <span className="text-red-500 text-sm mt-1 block">{errors.answer}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Display Order *</Label>
            <Input 
              type="number" 
              name="displayOrder"
              value={formData.displayOrder.toString()}
              onChange={handleChange}
              min="1" 
            />
            {errors.displayOrder && <span className="text-red-500 text-sm mt-1 block">{errors.displayOrder}</span>}
          </div>

          <div className="flex items-center space-x-3 pt-8">
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
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
          <button
            type="button"
            onClick={() => router.push('/admin/faq')}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : faqId ? 'Update FAQ' : 'Create FAQ'}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
