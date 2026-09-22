'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/admin/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Pagination from '@/components/admin/tables/Pagination';
import Badge from '@/components/admin/ui/badge/Badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/admin/ui/table';
import Select from '@/components/admin/form/Select';
import { getAdminOrders } from '@/service/admin-order.service';
import { OrderListItem, OrderStatus, PaymentStatus } from './types';
import { resolveImageSrc } from '@/lib/image';

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const SORT_BY_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'status', label: 'Order Status' },
];

const SORT_DIR_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOrders({
        page,
        size,
        status: status || undefined,
        sortBy,
        sortDir,
      });
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, status, sortBy, sortDir]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (statusStr: OrderStatus) => {
    switch (statusStr) {
      case 'DELIVERED':
        return 'success';
      case 'PENDING':
      case 'PROCESSING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'SHIPPED':
      case 'CONFIRMED':
        return 'primary';
      default:
        return 'light';
    }
  };

  const getPaymentStatusColor = (statusStr?: PaymentStatus) => {
    switch (statusStr) {
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
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" crumbs={[{ label: 'Dashboard', href: '/admin' }]} />

      <ComponentCard title="Order List" desc="Manage and track customer orders">
        {/* Filters and Sorting */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Status
            </label>
            <Select
              id="statusFilter"
              name="statusFilter"
              value={status}
              placeholder="All Statuses"
              options={[{ value: '', label: 'All Statuses' }, ...ORDER_STATUS_OPTIONS]}
              onChange={(val) => {
                setStatus(val as OrderStatus | '');
                setPage(0);
              }}
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <Select
              id="sortBy"
              name="sortBy"
              value={sortBy}
              placeholder="Sort By"
              options={SORT_BY_OPTIONS}
              onChange={(val) => {
                setSortBy(val as 'date' | 'status');
                setPage(0);
              }}
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort Direction
            </label>
            <Select
              id="sortDir"
              name="sortDir"
              value={sortDir}
              placeholder="Sort Direction"
              options={SORT_DIR_OPTIONS}
              onChange={(val) => {
                setSortDir(val as 'asc' | 'desc');
                setPage(0);
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      S. No.
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Order
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Delivery Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Total Items
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Total Value
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Payment
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <TableRow
                        key={order.orderId}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                      >
                        <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {page * size + index + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 font-medium text-brand-500 hover:text-brand-600 text-start text-theme-sm dark:text-brand-400">
                          <div className="flex items-center gap-3">
                            {order.imageUrl && (
                              <div className="w-10 h-10 overflow-hidden rounded-md border border-gray-200 shrink-0">
                                <img
                                  src={resolveImageSrc(order.imageUrl)}
                                  alt="Product"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <a href={`/admin/orders/${order.orderId}`}>#{order.orderId}</a>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {order.deliveryName}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {order.totalItems}
                        </TableCell>
                        <TableCell className="px-5 py-4 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                          {formatCurrency(order.totalOrderValue)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm">
                          <Badge size="sm" color={getStatusColor(order.orderStatus) as any}>
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm">
                          {order.paymentStatus ? (
                            <Badge size="sm" color={getPaymentStatusColor(order.paymentStatus) as any}>
                              {order.paymentStatus}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
