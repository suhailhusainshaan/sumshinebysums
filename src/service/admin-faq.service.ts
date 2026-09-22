import api from '@/lib/axios';
import { Faq, FaqCategory, FaqPaginatedResponse } from '@/types/faq';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getFaqCategories = () => 
  api.get<ApiResponse<FaqCategory[]>>('/admin/faqs/categories').then(res => res.data);

export const getFaqs = (params?: { page?: number; size?: number; category?: string }) => 
  api.get<ApiResponse<FaqPaginatedResponse>>('/admin/faqs', { params }).then(res => res.data);

export const getFaqById = (id: number | string) => 
  api.get<ApiResponse<Faq>>(`/admin/faqs/${id}`).then(res => res.data);

export const createFaq = (data: Partial<Faq> & { categorySlug: string }) => 
  api.post<ApiResponse<Faq>>('/admin/faqs', data).then(res => res.data);

export const updateFaq = (id: number | string, data: Partial<Faq> & { categorySlug: string }) => 
  api.put<ApiResponse<Faq>>(`/admin/faqs/${id}`, data).then(res => res.data);

export const toggleFaqStatus = (id: number | string, isActive: boolean) => 
  api.patch<ApiResponse<Faq>>(`/admin/faqs/${id}/status`, { isActive }).then(res => res.data);

export const reorderFaqs = (orderedIds: number[]) => 
  api.patch<ApiResponse<Faq[]>>('/admin/faqs/reorder', { orderedIds }).then(res => res.data);

export const deleteFaq = (id: number | string) => 
  api.delete<ApiResponse<any>>(`/admin/faqs/${id}`).then(res => res.data);
