const isDev = process.env.NODE_ENV === 'development';

export const API_BASE_URL = (
  isDev
    ? process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL
) || 'http://localhost:8080/api';

export const IMG_BASE_URL = (
  isDev
    ? process.env.NEXT_PUBLIC_LOCAL_IMG_URL || process.env.NEXT_PUBLIC_IMG_URL
    : process.env.NEXT_PUBLIC_IMG_URL
) || '';
