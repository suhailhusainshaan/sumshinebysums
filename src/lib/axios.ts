import axios from 'axios';
import { useLoadingStore } from '@/store/loadingStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

const showLoader = () => {
  useLoadingStore.getState().show();
};

const hideLoader = () => {
  useLoadingStore.getState().hide();
};

// Attach token and track global API loading state.
api.interceptors.request.use(
  (config) => {
    showLoader();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

export default api;
