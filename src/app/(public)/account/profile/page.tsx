'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import AccountSidebar from '@/components/account/AccountSidebar';
import Icon from '@/components/ui/AppIcon';
import useAuth from '@/hooks/useAuth';
import { authService } from '@/service/auth.service';
import toast from 'react-hot-toast';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMG_BASE_URL = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border animate-pulse">
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
        <div className="flex min-h-[calc(100vh-theme(spacing.24))] flex-col lg:flex-row">
          <div className="space-y-3 border-r border-border px-6 pt-8 lg:w-72 lg:shrink-0 animate-pulse">
            <div className="h-14 rounded-lg bg-muted" />
            <div className="h-28 rounded-lg bg-muted" />
            <div className="h-14 rounded-lg bg-muted" />
          </div>
          <div className="flex-1 min-w-0 px-8 pt-8 pb-12 lg:px-12 animate-pulse">
            <div className="mb-8 h-8 w-56 rounded bg-muted" />
            <div className="space-y-6 rounded-lg bg-card p-8 shadow-warm">
              <div className="h-24 rounded-2xl bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-12 rounded-md bg-muted" />
                <div className="h-12 rounded-md bg-muted" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-12 rounded-md bg-muted" />
                <div className="h-12 rounded-md bg-muted" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-12 rounded-md bg-muted" />
                <div className="h-12 rounded-md bg-muted" />
              </div>
              <div className="h-12 w-40 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AccountProfilePage() {
  const { user, isLoading, login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: '',
    username: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('/images/user/owner.jpg');
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const avatarSrc = useMemo(() => {
    if (avatarLoadError) return '/images/user/owner.jpg';
    return avatarPreview || '/images/user/owner.jpg';
  }, [avatarLoadError, avatarPreview]);

  useEffect(() => {
    if (!isLoading && user) {
      setFormData({
        firstName: user.firstName || user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        gender: user.gender || '',
        username: user.userName || user.username || '',
      });

      setAvatarLoadError(false);
      setAvatarPreview(user.avatar ? `${IMG_BASE_URL}/${user.avatar}` : '/images/user/owner.jpg');
    }
  }, [isLoading, user]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarLoadError(false);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required.');
      return;
    }

    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);

    try {
      const formPayload = new FormData();
      formPayload.append('email', formData.email);
      formPayload.append('firstName', formData.firstName);
      formPayload.append('lastName', formData.lastName);

      if (formData.mobile) formPayload.append('mobile', formData.mobile);
      if (formData.gender) formPayload.append('gender', formData.gender);
      if (formData.username) formPayload.append('userName', formData.username);
      if (user?.theme) formPayload.append('theme', user.theme);
      if (avatarFile) formPayload.append('avatar', avatarFile);

      const response = await authService.editProfile(formPayload);

      if (response?.status === 200) {
        const refreshed = await authService.me();
        if (refreshed?.status === 200 && refreshed.data) {
          login(refreshed.data);
          setAvatarPreview(
            refreshed.data.avatar
              ? `${IMG_BASE_URL}/${refreshed.data.avatar}`
              : '/images/user/owner.jpg'
          );
        }
        toast.success(response.message || 'Profile updated successfully.');
      } else {
        setError(response?.message || 'Unable to update your profile.');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        'Unable to update your profile.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <div className="px-4 py-4 border-b border-border sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="transition-luxe hover:text-primary">
              Home
            </Link>
            <Icon name="ChevronRightIcon" size={14} />
            <span className="text-foreground">Edit Profile</span>
          </nav>
        </div>

        <div className="flex min-h-[calc(100vh-theme(spacing.24))] flex-col lg:flex-row">
          <AccountSidebar active="profile" />

          <div className="flex-1 min-w-0 px-4 pb-12 pt-8 sm:px-8 lg:px-12">
            <div className="mb-8 flex items-baseline gap-3">
              <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
                Edit Profile
              </h1>
            </div>

            <div className="rounded-lg bg-card p-6 shadow-warm sm:p-8">
              <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5 text-center">
                <div className="relative h-28 w-28">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-background shadow-lg ring-1 ring-border">
                    <Image
                      src={avatarSrc}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                      onError={() => setAvatarLoadError(true)}
                    />
                  </div>

                  <label
                    htmlFor="profile-avatar-upload"
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:scale-105 hover:border-primary hover:text-primary"
                    aria-label="Change profile photo"
                  >
                    <Icon name="PencilIcon" size={16} />
                  </label>

                  <input
                    id="profile-avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-md border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">First name</span>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                      placeholder="First name"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Last name</span>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                      placeholder="Last name"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Email</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                      placeholder="Email address"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Mobile</span>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                      placeholder="Mobile number"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Username</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                      placeholder="Username"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Gender</span>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-input px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                    >
                      <option value="">Select gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-luxe hover:shadow-warm-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
                    <Icon name="CheckIcon" size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
