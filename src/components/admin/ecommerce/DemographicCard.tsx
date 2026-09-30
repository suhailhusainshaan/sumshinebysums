'use client';

import { TopLocationPoint } from '@/types/admin-dashboard';

interface DemographicCardProps {
  topLocations: TopLocationPoint[];
}

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);
const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(value);

export default function DemographicCard({ topLocations }: DemographicCardProps) {
  const topLocation = topLocations[0];
  const totalOrders = topLocations.reduce((sum, location) => sum + location.count, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Delivery Locations
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Orders by shipping state or city
        </p>
      </div>

      {topLocation ? (
        <>
          <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 dark:border-brand-500/20 dark:from-brand-500/10 dark:to-white/[0.03]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-theme-xs font-medium uppercase tracking-wide text-brand-500 dark:text-brand-400">
                  Leading location
                </p>
                <h4 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white/90">
                  {topLocation.name}
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatNumber(topLocation.count)} of {formatNumber(totalOrders)} orders
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-theme-sm dark:bg-gray-900">
                📍
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {topLocations.map((location, index) => (
              <div key={location.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                        {location.name}
                      </p>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {formatNumber(location.count)} order{location.count === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {location.percent}%
                  </p>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-brand-500"
                    style={{ width: `${clampPercent(location.percent)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          No location data yet.
        </div>
      )}
    </div>
  );
}
