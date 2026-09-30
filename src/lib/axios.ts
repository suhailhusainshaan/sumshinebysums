import axios from 'axios';
import { API_BASE_URL } from '@/lib/runtime-env';
import { useLoadingStore } from '@/store/loadingStore';

const api = axios.create({
  baseURL: API_BASE_URL,
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
