'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { MonthlyOrderPoint } from '@/types/admin-dashboard';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface MonthlySalesChartProps {
  monthlyOrders: MonthlyOrderPoint[];
}

export default function MonthlySalesChart({ monthlyOrders }: MonthlySalesChartProps) {
  const options: ApexOptions = {
    colors: ['#465fff'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: monthlyOrders.map((item) => item.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex]?.[dataPointIndex] ?? 0;
        return `<div style="background:#fff;color:#344054;border:1px solid #e4e7ec;border-radius:8px;padding:8px 10px;font-size:12px;font-weight:600;box-shadow:0 4px 12px rgba(16,24,40,.12);">${value} orders</div>`;
      },
    },
  };
  const series = [
    {
      name: 'Orders',
      data: monthlyOrders.map((item) => item.orders),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Orders</h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
