'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { authService } from '@/service/auth.service';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/AppIcon';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMG_BASE_URL = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
export default function ProfilePage() {
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

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
      setAvatarPreview(IMG_BASE_URL + '/' + user.avatar || '/images/user/owner.jpg');
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

  const handleAvatarChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];

      if (!file) return;

      setAvatarFile(file);

      const previewUrl = URL.createObjectURL(file);

      setAvatarPreview(previewUrl);
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

      if (formData.mobile) {
        formPayload.append('mobile', formData.mobile);
      }

      if (formData.gender) {
        formPayload.append('gender', formData.gender);
      }

      if (formData.username) {
        formPayload.append('userName', formData.username);
      }

      if (user?.theme) {
        formPayload.append('theme', user.theme);
      }

      if (avatarFile) {
        formPayload.append('avatar', avatarFile);
      }

      const response = await authService.editProfile(formPayload);

      if (response?.status === 200) {
        const refreshed = await authService.me();
        if (refreshed?.status === 200 && refreshed.data) {
          login(refreshed.data);
          setAvatarPreview(IMG_BASE_URL + '/' + refreshed.data.avatar || '/images/user/owner.jpg');
        }
        toast.success(response.message || 'Profile updated successfully.');
      } else {
        setError(response?.message || 'Unable to update your profile.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unable to update your profile.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
        <div className="rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-warm">
          <div className="h-10 w-10 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-14">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-10 shadow-warm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Edit Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your personal information and keep your account details current.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border bg-input p-6 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-border bg-white sm:mx-0">
            <Image
              src={avatarPreview || '/images/user/owner.jpg'}
              alt="Avatar preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 text-center sm:text-left">
            <label className="inline-flex cursor-pointer items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary">
              <span>Select avatar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
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
                className="w-full h-12 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                placeholder="First name"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Last name</span>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full h-12 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
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
                className="w-full h-12 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                placeholder="Email address"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Mobile</span>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full h-12 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
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
                className="w-full h-12 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
                placeholder="Username"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Gender</span>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full h-12 rounded-md border border-border bg-input px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-luxe hover:shadow-warm-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
            <Icon name="CheckIcon" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
