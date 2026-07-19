import axios from 'axios';
import api from '@/lib/axios';
import { ApiEnvelope } from '@/types/checkout';
import { OrderDetail, OrderListData } from '@/types/orders';

export function getApiMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * GET /orders
 * Returns all orders for the authenticated customer,
 * each with a grouped list of items.
 */
export async function getMyOrders(): Promise<ApiEnvelope<OrderListData>> {
  const res = await api.get<ApiEnvelope<OrderListData>>('/orders');
  return res.data;
}

/**
 * GET /orders/:orderId
 * Returns full order detail including shipping address and timeline events.
 *
 * Pass orderItemId to get a product-focused view (only that item in `data.items`).
 */
export async function getOrderDetail(
  orderId: number,
  orderItemId?: number,
): Promise<ApiEnvelope<OrderDetail>> {
  const params = orderItemId ? { orderItemId } : undefined;
  const res = await api.get<ApiEnvelope<OrderDetail>>(`/orders/${orderId}`, { params });
  return res.data;
}
