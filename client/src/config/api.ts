import axios, { type AxiosRequestConfig } from 'axios';

export const authConfig = (token: string): AxiosRequestConfig => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;
  if (typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return error.request
    ? 'Cannot reach the server. Check your connection and try again.'
    : error.message || fallback;
};
