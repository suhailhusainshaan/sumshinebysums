import api from '@/lib/axios';
import { StaticPage, StaticPageSummary, PagePaginatedResponse } from '@/types/page';
import { ApiResponse } from '@/service/admin-faq.service'; // Reusing ApiResponse

export const getAdminPages = () => 
  api.get<ApiResponse<PagePaginatedResponse>>('/admin/pages').then(res => res.data);

export const getAdminPageById = (id: number | string) => 
  api.get<ApiResponse<StaticPage>>(`/admin/pages/${id}`).then(res => res.data);

export const createAdminPage = (data: Partial<StaticPage>) => 
  api.post<ApiResponse<StaticPage>>('/admin/pages', data).then(res => res.data);

export const updateAdminPage = (id: number | string, data: Partial<StaticPage>) => 
  api.put<ApiResponse<StaticPage>>(`/admin/pages/${id}`, data).then(res => res.data);

export const toggleAdminPageStatus = (id: number | string, isActive: boolean) => 
  api.patch<ApiResponse<StaticPage>>(`/admin/pages/${id}/status`, { isActive }).then(res => res.data);

export const deleteAdminPage = (id: number | string) => 
  api.delete<ApiResponse<any>>(`/admin/pages/${id}`).then(res => res.data);
