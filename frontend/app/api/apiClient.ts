import axios from 'axios';
import useStore from '@/store/useStore'; // Import Zustand store

// Determine the base URL for the API.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Use proxied path for development

// Create an Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
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

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Use apiClient for refresh to maintain consistent baseURL
          const response = await apiClient.post('/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          useStore.getState().setToken(access_token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        // Directly call the logout logic from useStore or a dedicated auth utility
        // to avoid circular dependencies with auth-service.ts logoutUser
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        useStore.getState().logout();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
