'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { MonthlyPaceData } from '@/types/admin-dashboard';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface MonthlyTargetProps {
  monthlyPace: MonthlyPaceData;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

export default function MonthlyTarget({ monthlyPace }: MonthlyTargetProps) {
  const chartPercent = clampPercent(monthlyPace.percent);
  const changeIsPositive = monthlyPace.changePercent >= 0;
  const series = [chartPercent];
  const options: ApexOptions = {
    colors: ['#465FFF'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'radialBar',
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: '80%',
        },
        track: {
          background: '#E4E7EC',
          strokeWidth: '100%',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '36px',
            fontWeight: '600',
            offsetY: -40,
            color: '#1D2939',
            formatter: () => `${Math.round(monthlyPace.percent)}%`,
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#465FFF'],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Pace</h3>
          <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
            Current month revenue compared to last month
          </p>
        </div>

        <div className="relative ">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>

          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
              changeIsPositive
                ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
            }`}
          >
            {changeIsPositive ? '+' : ''}
            {monthlyPace.changePercent}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {formatCurrency(monthlyPace.currentMonthRevenue)} revenue this month.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Last Month
          </p>
          <p className="text-center text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(monthlyPace.lastMonthRevenue)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            This Month
          </p>
          <p className="text-center text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(monthlyPace.currentMonthRevenue)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Today
          </p>
          <p className="text-center text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(monthlyPace.todayRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
