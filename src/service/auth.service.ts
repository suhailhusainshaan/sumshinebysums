import api from '@/lib/axios';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // This returns your { data, message, status } object
  },
  googleLogin: async (data: { idToken: string }) => {
    const response = await api.post('/auth/google', data);
    return response.data;
  },
  otpOptions: async (identifier: string) => {
    const response = await api.post('/auth/otp/options', { identifier });
    return response.data;
  },
  sendOtp: async (requestId: string, method: 'EMAIL' | 'WHATSAPP') => {
    const response = await api.post('/auth/otp/send', { requestId, method });
    return response.data;
  },
  verifyOtp: async (requestId: string, otp: string) => {
    const response = await api.post('/auth/otp/verify', { requestId, otp });
    return response.data;
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const response = await api.put('/admin/users/me', data);
    return response.data;
  },
  editProfile: async (data: FormData) => {
    const response = await api.put('/auth/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/admin/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data; // { data, message, status }
  },
  updateTheme: async (theme: 'light' | 'dark') => {
    const response = await api.put('/auth/theme', { theme });
    return response.data;
  },
};
