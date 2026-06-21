import api from '@/lib/axios';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // This returns your { data, message, status } object
  },
  googleLogin: async (data: { token: string }) => {
    const response = await api.post('/auth/google', data);
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data; // { data, message, status }
  },
};
