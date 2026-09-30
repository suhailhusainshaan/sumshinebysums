import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Sumshine by Sums',
  description: 'Admin dashboard for orders, revenue, and delivery locations',
};

export default function Ecommerce() {
  return <DashboardClient />;
}
