'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/admin/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Badge from '@/components/admin/ui/badge/Badge';
import Button from '@/components/admin/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/admin/ui/table';
import Select from '@/components/admin/form/Select';
import { getAdminOrderDetail, updateAdminOrderStatus } from '@/service/admin-order.service';
import { OrderDetailData, OrderStatus, PaymentStatus } from '../types';
import { resolveImageSrc } from '@/lib/image';

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [statusInput, setStatusInput] = useState<OrderStatus | ''>('');

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOrderDetail(orderId as string);
      setOrder(res.data);
      setStatusInput(res.data.orderStatus);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId, fetchOrderDetail]);

  const handleUpdateStatus = async () => {
    if (!statusInput || statusInput === order?.orderStatus) return;
    try {
      setIsUpdating(true);
      await updateAdminOrderStatus(orderId as string, statusInput as OrderStatus);
      // Refresh order
      await fetchOrderDetail();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const getStatusColor = (statusStr: OrderStatus) => {
    switch (statusStr) {
      case 'DELIVERED': return 'success';
      case 'PENDING':
      case 'PROCESSING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'SHIPPED':
      case 'CONFIRMED': return 'primary';
      default: return 'light';
    }
  };

  const getPaymentStatusColor = (statusStr?: PaymentStatus) => {
    switch (statusStr) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED': return 'dark';
      default: return 'light';
    }
  };

  if (loading) {
    return <div className="p-6">Loading order details...</div>;
  }

  if (error && !order) {
    return <div className="p-6 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  }

  if (!order) return null;

  return (
    <div>
      <PageBreadcrumb
        pageTitle={`Order #${order.orderId}`}
        crumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Orders', href: '/admin/orders' }
        ]}
      />

      {error && (
        <div className="mb-4 text-red-500 text-sm p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Summary & Status Update */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard title="Order Summary">
            <div className="flex flex-col sm:flex-row justify-between mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Order Value</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {formatCurrency(order.totalOrderValue)}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0 text-left sm:text-right">
                {order.paymentStatus && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment</p>
                    <Badge size="md" color={getPaymentStatusColor(order.paymentStatus) as any}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order Status</p>
                  <Badge size="md" color={getStatusColor(order.orderStatus) as any}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
                Update Order Status
              </h4>
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full sm:w-64">
                  <Select
                    id="orderStatus"
                    name="orderStatus"
                    value={statusInput}
                    options={ORDER_STATUS_OPTIONS}
                    onChange={(val) => setStatusInput(val as OrderStatus)}
                  />
                </div>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || statusInput === order.orderStatus}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          </ComponentCard>

          {/* Order Items */}
          <ComponentCard title={`Order Items (${order.items.length})`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-xs">Item</TableCell>
                    <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-xs">Category</TableCell>
                    <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-end text-xs">Price</TableCell>
                    <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-center text-xs">Qty</TableCell>
                    <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-end text-xs">Discount</TableCell>
                    <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-end text-xs">Total</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, idx) => {
                    const itemImage = item.variantImageUrl || item.productImageUrl;
                    return (
                      <TableRow key={idx}>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {itemImage && (
                              <div className="w-12 h-12 overflow-hidden rounded-md border border-gray-200 shrink-0">
                                <img
                                  src={resolveImageSrc(itemImage)}
                                  alt={item.itemName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white/90 text-sm">{item.itemName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {item.itemSku}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {item.itemCategory}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-end text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.itemPrice)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-end text-sm text-gray-500 dark:text-gray-400">
                          {item.discountApplied > 0 ? formatCurrency(item.discountApplied) : '-'}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-end text-sm font-semibold text-gray-800 dark:text-white/90">
                          {formatCurrency(item.lineTotal)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </ComponentCard>
        </div>

        {/* Delivery Details */}
        <div className="lg:col-span-1">
          <ComponentCard title="Delivery Details">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
                <p className="font-medium text-gray-800 dark:text-white/90 text-sm">
                  {order.deliveryDetails.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact Number</p>
                <p className="font-medium text-gray-800 dark:text-white/90 text-sm">
                  {order.deliveryDetails.contactNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivery Address</p>
                <p className="font-medium text-gray-800 dark:text-white/90 text-sm whitespace-pre-line">
                  {order.deliveryDetails.address}
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
