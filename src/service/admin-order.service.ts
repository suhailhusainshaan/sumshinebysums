import api from '@/lib/axios';
import {
  OrderStatus,
  PaginatedResponse,
  OrderListItem,
  OrderDetailResponse,
} from '@/app/admin/orders/types';

export const getAdminOrders = async (params: {
  page?: number;
  size?: number;
  status?: OrderStatus | '';
  sortBy?: 'date' | 'status';
  sortDir?: 'asc' | 'desc';
}): Promise<PaginatedResponse<OrderListItem>> => {
  const { data } = await api.get('/admin/orders', { params });
  return data;
};

export const getAdminOrderDetail = async (
  orderId: string | number
): Promise<OrderDetailResponse> => {
  const { data } = await api.get(`/admin/orders/${orderId}`);
  return data;
};

export const updateAdminOrderStatus = async (
  orderId: string | number,
  status: OrderStatus
): Promise<unknown> => {
  const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return data;
};
