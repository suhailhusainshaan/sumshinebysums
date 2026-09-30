'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAdminOrders } from '@/service/admin-order.service';
import { OrderListItem, OrderStatus, PaymentStatus } from '@/app/admin/orders/types';
import { resolveImageSrc } from '@/lib/image';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'PENDING':
    case 'PROCESSING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'primary';
  }
}

function getPaymentStatusColor(status?: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'error';
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
      return 'dark';
    default:
      return 'light';
  }
}

interface RecentOrdersProps {
  orders?: OrderListItem[];
}

export default function RecentOrders({ orders: dashboardOrders }: RecentOrdersProps) {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dashboardOrders) {
      setOrders(dashboardOrders);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        const res = await getAdminOrders({ page: 0, size: 5, sortBy: 'date', sortDir: 'desc' });
        if (active) setOrders(res.data.content);
      } catch (err: unknown) {
        if (!active) return;
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : null;
        setError(message || 'Failed to fetch recent orders');
        setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      active = false;
    };
  }, [dashboardOrders]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Orders</h3>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          See all
        </Link>
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Order
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status|Payment
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="py-3">
                    <Link
                      href={`/admin/orders/${order.orderId}`}
                      className="flex items-center gap-3"
                    >
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
                        {order.imageUrl ? (
                          <img
                            src={resolveImageSrc(order.imageUrl)}
                            className="h-[50px] w-[50px] object-cover"
                            alt={`Order #${order.orderId}`}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-theme-xs text-gray-400">
                            #{String(order.orderId).slice(0, 4)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-brand-500 text-theme-sm hover:text-brand-600 dark:text-brand-400">
                          #{order.orderId}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.totalItems} item{order.totalItems === 1 ? '' : 's'}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(order.orderDate)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.deliveryName}
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {formatCurrency(order.totalOrderValue)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge size="sm" color={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      {order.paymentStatus && (
                        <Badge size="sm" color={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
