import axios from 'axios';
import { API_URL } from './api-config';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  }

  failedQueue = [];
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (globalThis.window !== undefined) {
      const token = globalThis.window.localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints
    if (originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (globalThis.window !== undefined) {
        const refreshToken = globalThis.window.localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token, logout
          isRefreshing = false;
          processQueue(new Error('No refresh token'), null);
          globalThis.window.localStorage.clear();
          if (globalThis.window.location.pathname.startsWith('/admin')) {
            globalThis.window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
          
          globalThis.window.localStorage.setItem('token', newToken);
          globalThis.window.localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          processQueue(null, newToken);
          
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          isRefreshing = false;
          processQueue(refreshError, null);
          globalThis.window.localStorage.clear();
          
          if (globalThis.window.location.pathname.startsWith('/admin')) {
            globalThis.window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
