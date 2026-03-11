import api from '@/lib/axios';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // This returns your { data, message, status } object
  },
};
