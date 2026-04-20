'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

type UserRecord = {
  id: number;
  username?: string;
  userName?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  gender?: string;
  mobile?: string;
  roleCode?: 'SUPER_ADMIN' | 'USER';
  roleName?: string;
  isActive?: boolean;
  accountLocked?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
};

type UsersResponse = {
  data: {
    content?: UserRecord[];
    items?: UserRecord[];
    totalPages?: number;
    totalElements?: number;
  } | UserRecord[];
  status: number;
  message: string;
};

type StatsResponse = {
  data: Record<string, number>;
  status: number;
  message: string;
};

const passwordStrength = /^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$/;

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    roleCode: '',
    gender: '',
    is_active: '',
    account_locked: '',
    created_from: '',
    created_to: '',
    last_login_from: '',
    last_login_to: '',
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [resetUser, setResetUser] = useState<UserRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchStats = async () => {
    try {
      const response = await api.get<StatsResponse>('/admin/users/stats');
      if (response.data?.status === 200) {
        setStats(response.data.data || {});
      }
    } catch (error) {
      console.error('Failed to fetch user stats', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<UsersResponse>('/admin/users', {
        params: {
          page: currentPage,
          size: 20,
          sort: 'createdAt,desc',
          q: search || undefined,
          roleCode: filters.roleCode || undefined,
          gender: filters.gender || undefined,
          is_active: filters.is_active || undefined,
          account_locked: filters.account_locked || undefined,
          created_from: filters.created_from || undefined,
          created_to: filters.created_to || undefined,
          last_login_from: filters.last_login_from || undefined,
          last_login_to: filters.last_login_to || undefined,
        },
      });

      const payload = response.data?.data;
      const list = Array.isArray(payload)
        ? payload
        : payload?.content || payload?.items || [];
      setUsers(list);
      setTotalPages(
        Array.isArray(payload) ? 1 : payload?.totalPages ?? Math.max(1, currentPage + 1)
      );
      setTotalElements(
        Array.isArray(payload) ? list.length : payload?.totalElements ?? list.length
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage]);

  const applyFilters = () => {
    setCurrentPage(0);
    fetchUsers();
    fetchStats();
  };

  const statsValues = useMemo(() => {
    const total = stats.total ?? stats.totalUsers ?? stats.count ?? totalElements ?? 0;
    const active = stats.active ?? stats.activeUsers ?? 0;
    const locked = stats.locked ?? stats.lockedUsers ?? 0;
    const superAdmins = stats.superAdmin ?? stats.superAdmins ?? 0;
    return { total, active, locked, superAdmins };
  }, [stats, totalElements]);

  const openCreate = () => {
    setEditingUser(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    setEditingUser(user);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const openReset = (user: UserRecord) => {
    setResetUser(user);
    setResetPassword('');
    setErrors({});
    setIsResetOpen(true);
  };

  const closeReset = () => {
    setIsResetOpen(false);
    setResetUser(null);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const isCreate = !editingUser;
    const nextErrors: Record<string, string> = {};

    const username = String(payload.username || '').trim();
    const email = String(payload.email || '').trim();
    const password = String(payload.password || '').trim();

    if (isCreate) {
      if (!username) nextErrors.username = 'Username is required';
      if (!email) nextErrors.email = 'Email is required';
      if (!password) nextErrors.password = 'Password is required';
      if (password && !passwordStrength.test(password)) {
        nextErrors.password = 'Password must be 8+ chars with uppercase, number, special char';
      }
    } else {
      const hasChanges =
        username ||
        email ||
        password ||
        payload.firstName ||
        payload.lastName ||
        payload.gender ||
        payload.mobile ||
        payload.roleCode;
      if (!hasChanges) {
        nextErrors.form = 'Please update at least one field.';
      }
      if (password && !passwordStrength.test(password)) {
        nextErrors.password = 'Password must be 8+ chars with uppercase, number, special char';
      }
    }

    if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      nextErrors.email = 'Invalid email format';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (isCreate) {
        const response = await api.post('/admin/users', {
          username,
          email,
          password,
          firstName: payload.firstName || undefined,
          lastName: payload.lastName || undefined,
          gender: payload.gender || undefined,
          mobile: payload.mobile || undefined,
          roleCode: payload.roleCode || undefined,
        });
        if (response.data?.status === 200) {
          toast.success(response.data?.message || 'User created');
          closeModal();
          fetchUsers();
          fetchStats();
        }
      } else if (editingUser) {
        const updatePayload: Record<string, any> = {};
        if (username) updatePayload.username = username;
        if (email) updatePayload.email = email;
        if (payload.firstName) updatePayload.firstName = payload.firstName;
        if (payload.lastName) updatePayload.lastName = payload.lastName;
        if (payload.gender) updatePayload.gender = payload.gender;
        if (payload.mobile) updatePayload.mobile = payload.mobile;
        if (payload.roleCode) updatePayload.roleCode = payload.roleCode;
        if (password) updatePayload.password = password;

        const response = await api.put(`/admin/users/${editingUser.id}`, updatePayload);
        if (response.data?.status === 200) {
          toast.success(response.data?.message || 'User updated');
          closeModal();
          fetchUsers();
          fetchStats();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to save user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (user: UserRecord, type: 'active' | 'lock') => {
    try {
      const endpoint =
        type === 'active'
          ? `/admin/users/${user.id}/toggle-active`
          : `/admin/users/${user.id}/toggle-lock`;
      const value = type === 'active' ? !user.isActive : !user.accountLocked;
      const response = await api.patch(endpoint, { value });
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'User updated');
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update user.');
    }
  };

  const handleDelete = async (userId: number) => {
    const ok = window.confirm('Are you sure you want to delete this user?');
    if (!ok) return;
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'User deleted');
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete user.');
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one user.');
      return;
    }
    const ok = window.confirm('Delete selected users?');
    if (!ok) return;
    try {
      const response = await api.post('/admin/users/bulk-delete', { ids: selected });
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Users deleted');
        setSelected([]);
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete users.');
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resetUser) return;
    if (!passwordStrength.test(resetPassword)) {
      setErrors({ resetPassword: 'Password must be 8+ chars with uppercase, number, special char' });
      toast.error('Please enter a strong password.');
      return;
    }
    try {
      const response = await api.put(`/admin/users/${resetUser.id}/reset-password`, {
        newPassword: resetPassword,
      });
      if (response.data?.status === 200) {
        toast.success(response.data?.message || 'Password reset');
        closeReset();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to reset password.');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/users/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'users.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to export CSV.');
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(users.map((user) => user.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (userId: number) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb pageTitle="User Management" />

      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Users</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {statsValues.total}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-xs uppercase tracking-wide text-gray-400">Active</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {statsValues.active}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-xs uppercase tracking-wide text-gray-400">Locked</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {statsValues.locked}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-xs uppercase tracking-wide text-gray-400">Super Admins</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {statsValues.superAdmins}
            </p>
          </div>
        </div>

        <ComponentCard title="Users" desc="Manage users, roles, and access">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Search users..."
                  className="h-10 min-w-[220px] rounded-full border border-gray-200 bg-gray-50 pl-4 pr-4 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
                />
              </div>
              <select
                value={filters.roleCode}
                onChange={(e) => setFilters((prev) => ({ ...prev, roleCode: e.target.value }))}
                className="h-10 rounded-full border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="USER">User</option>
              </select>
              <select
                value={filters.gender}
                onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                className="h-10 rounded-full border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
              <select
                value={filters.is_active}
                onChange={(e) => setFilters((prev) => ({ ...prev, is_active: e.target.value }))}
                className="h-10 rounded-full border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Active?</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <select
                value={filters.account_locked}
                onChange={(e) => setFilters((prev) => ({ ...prev, account_locked: e.target.value }))}
                className="h-10 rounded-full border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Locked?</option>
                <option value="true">Locked</option>
                <option value="false">Unlocked</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={applyFilters}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Apply Filters
              </button>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-2 rounded-full border border-error-200 bg-error-50 px-4 py-2.5 text-sm font-medium text-error-600 shadow-theme-xs hover:bg-error-100"
              >
                Bulk Delete
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Export CSV
              </button>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
              >
                Add User
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              type="date"
              value={filters.created_from}
              onChange={(e) => setFilters((prev) => ({ ...prev, created_from: e.target.value }))}
            />
            <Input
              type="date"
              value={filters.created_to}
              onChange={(e) => setFilters((prev) => ({ ...prev, created_to: e.target.value }))}
            />
            <Input
              type="date"
              value={filters.last_login_from}
              onChange={(e) => setFilters((prev) => ({ ...prev, last_login_from: e.target.value }))}
            />
            <Input
              type="date"
              value={filters.last_login_to}
              onChange={(e) => setFilters((prev) => ({ ...prev, last_login_to: e.target.value }))}
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <table className="w-full table-auto">
                  <thead className="border-b border-gray-100 bg-gray-50/70 dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={selected.length > 0 && selected.length === users.length}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                        User
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                        Role
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                        Created
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-5 text-sm text-gray-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-5 text-sm text-gray-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              checked={selected.includes(user.id)}
                              onChange={() => toggleSelect(user.id)}
                            />
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || user.username}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {user.roleName || user.roleCode}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Badge size="sm" color={user.isActive ? 'success' : 'warning'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge size="sm" color={user.accountLocked ? 'error' : 'light'}>
                                {user.accountLocked ? 'Locked' : 'Open'}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                className="text-primary hover:underline"
                                onClick={() => openEdit(user)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-primary hover:underline"
                                onClick={() => handleToggle(user, 'active')}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                className="text-primary hover:underline"
                                onClick={() => handleToggle(user, 'lock')}
                              >
                                {user.accountLocked ? 'Unlock' : 'Lock'}
                              </button>
                              <button
                                className="text-primary hover:underline"
                                onClick={() => openReset(user)}
                              >
                                Reset Password
                              </button>
                              <button
                                className="text-error-500 hover:underline"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {users.length} of {totalElements}
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </ComponentCard>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[720px] p-6 lg:p-10">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {editingUser ? 'Edit User' : 'Create User'}
            </h3>
            <p className="text-sm text-gray-500">
              {editingUser
                ? 'Update user details and role.'
                : 'Create a new user account.'}
            </p>
          </div>
          {errors.form && <p className="text-sm text-error-500">{errors.form}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Username *</Label>
              <Input name="username" defaultValue={editingUser?.username || editingUser?.userName} />
              {errors.username && <p className="text-xs text-error-500">{errors.username}</p>}
            </div>
            <div>
              <Label>Email *</Label>
              <Input name="email" defaultValue={editingUser?.email} />
              {errors.email && <p className="text-xs text-error-500">{errors.email}</p>}
            </div>
            <div>
              <Label>First Name</Label>
              <Input name="firstName" defaultValue={editingUser?.firstName} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input name="lastName" defaultValue={editingUser?.lastName} />
            </div>
            <div>
              <Label>Gender</Label>
              <select name="gender" defaultValue={editingUser?.gender || ''} className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
            <div>
              <Label>Mobile</Label>
              <Input name="mobile" defaultValue={editingUser?.mobile} />
            </div>
            <div>
              <Label>Role</Label>
              <select name="roleCode" defaultValue={editingUser?.roleCode || 'USER'} className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option value="USER">User</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <div>
              <Label>{editingUser ? 'New Password' : 'Password *'}</Label>
              <Input name="password" type="password" />
              {errors.password && <p className="text-xs text-error-500">{errors.password}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isResetOpen} onClose={closeReset} className="max-w-[520px] p-6 lg:p-10">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Reset Password
            </h3>
            <p className="text-sm text-gray-500">Set a new password for the user.</p>
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
            {errors.resetPassword && (
              <p className="text-xs text-error-500">{errors.resetPassword}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Reset Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
