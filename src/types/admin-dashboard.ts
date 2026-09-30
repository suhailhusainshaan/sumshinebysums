import { OrderListItem } from '@/app/admin/orders/types';

export interface DashboardSummary {
  customersCount: number;
  ordersCount: number;
  revenue: number;
}

export interface MonthlyOrderPoint {
  month: string;
  orders: number;
}

export interface MonthlyPaceData {
  changePercent: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  percent: number;
  todayRevenue: number;
}

export interface RevenueStatisticPoint {
  date: string;
  revenue: number;
}

export interface TopLocationPoint {
  count: number;
  name: string;
  percent: number;
}

export interface AdminDashboardData {
  summary: DashboardSummary;
  monthlyPace: MonthlyPaceData;
  monthlyOrders: MonthlyOrderPoint[];
  revenueStatistics: RevenueStatisticPoint[];
  topLocations: TopLocationPoint[];
  recentOrders: OrderListItem[];
}

export interface AdminDashboardResponse {
  data: AdminDashboardData;
  message: string;
  status: number;
}
