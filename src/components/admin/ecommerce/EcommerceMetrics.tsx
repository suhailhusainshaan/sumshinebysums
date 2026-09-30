'use client';

import { BoxIconLine, GroupIcon } from '@/icons/admin';
import { DashboardSummary } from '@/types/admin-dashboard';

interface EcommerceMetricsProps {
  summary: DashboardSummary;
}

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(value);

export const EcommerceMetrics = ({ summary }: EcommerceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(summary.customersCount)}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(summary.ordersCount)}
          </h4>
        </div>
      </div>
    </div>
  );
};
