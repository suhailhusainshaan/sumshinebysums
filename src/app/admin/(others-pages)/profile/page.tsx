'use client';

import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';

export default function Profile() {
  const { user, isLoading } = useAuth();

  return (
    <div>
      <PageBreadcrumb pageTitle="User Details" />
      <div className="space-y-6">
        <ComponentCard title="Profile" desc="Account details">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-white/[0.05]" />
              <div className="h-5 w-48 rounded bg-gray-100 dark:bg-white/[0.05]" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`user-skel-${index}`}
                    className="h-10 rounded-xl bg-gray-100 dark:bg-white/[0.05]"
                  />
                ))}
              </div>
            </div>
          ) : !user ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              Unable to load user details. Please log in again.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
                  <Image
                    width={64}
                    height={64}
                    src={user.avatar || '/images/user/owner.jpg'}
                    alt={user.name || 'User'}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {user.roleName || user.role}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Role Code</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {user.roleCode || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Gender</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {user.gender || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Username</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {user.userName || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Theme</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {user.theme || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wide text-gray-400">User ID</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
