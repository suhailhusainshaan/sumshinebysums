'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { EcommerceMetrics } from '@/components/admin/ecommerce/EcommerceMetrics';
import MonthlyTarget from '@/components/admin/ecommerce/MonthlyTarget';
import MonthlySalesChart from '@/components/admin/ecommerce/MonthlySalesChart';
import StatisticsChart from '@/components/admin/ecommerce/StatisticsChart';
import RecentOrders from '@/components/admin/ecommerce/RecentOrders';
import DemographicCard from '@/components/admin/ecommerce/DemographicCard';
import { getAdminDashboard } from '@/service/admin-order.service';
import { AdminDashboardData } from '@/types/admin-dashboard';

export default function DashboardClient() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await getAdminDashboard();
        if (active) setDashboard(res.data);
      } catch (err: unknown) {
        if (!active) return;
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : null;
        setError(message || 'Failed to fetch dashboard');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error || 'Dashboard data unavailable'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics summary={dashboard.summary} />

        <MonthlySalesChart monthlyOrders={dashboard.monthlyOrders} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget monthlyPace={dashboard.monthlyPace} />
      </div>

      <div className="col-span-12">
        <RecentOrders orders={dashboard.recentOrders} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard topLocations={dashboard.topLocations} />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <StatisticsChart revenueStatistics={dashboard.revenueStatistics} />
      </div>
    </div>
  );
}
