'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useRouter } from 'next/navigation'; // For redirection
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, any> = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender || undefined,
        mobile: formData.phone || undefined,
      };

      const res = await api.post('/auth/register', payload);

      if (res.data?.status === 200) {
        const expiryTime = Date.now() + (res.data.data?.tokenExpiry || 0);
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        localStorage.setItem('expiry_time', String(expiryTime));
        toast.success(res.data?.message || 'Registration successful!');
        const redirectUrl =
          res.data?.data?.user?.roleCode === 'SUPER_ADMIN' ? '/admin' : '/';
        router.push(redirectUrl);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-card w-full max-w-md p-10 rounded-xl shadow-warm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-heading font-semibold text-primary">Sunshine by Sums</h1>
          <p className="text-muted-foreground text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-600">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              className="h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />

            <input
              type="text"
              placeholder="Last name"
              className="h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>

          <input
            type="email"
            placeholder="Email address"
            className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile number"
            className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <select
            className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full h-12 px-4 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:shadow-warm-md transition-luxe flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Creating...' : 'Create Account'}</span>
            <Icon name="ArrowRightIcon" size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <span className="text-primary cursor-pointer hover:underline" onClick={handleLoginClick}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
