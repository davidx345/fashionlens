import { AxiosError } from 'axios'; // Import AxiosError directly
import useStore from '@/store/useStore'; // Import Zustand store
import apiClient, { API_BASE_URL } from '../apiClient'; // Import the shared apiClient and API_BASE_URL

// Determine the base URL for the API.
// If NEXT_PUBLIC_API_URL is set in the environment, use it.
// Otherwise, default to 'http://localhost:5000/api' for local development.
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; // apiClient handles this

// Create an Axios instance for API calls
// const apiClient = axios.create({ // This is now in apiClient.ts
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Important for sending/receiving cookies if using HttpOnly cookies for sessions
// });

// Add a request interceptor to include the token in headers
// apiClient.interceptors.request.use( // This is now in apiClient.ts
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('accessToken');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor to handle token refresh
// apiClient.interceptors.response.use( // This is now in apiClient.ts
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
//             headers: { Authorization: `Bearer ${refreshToken}` }
//           });
          
//           const { access_token } = response.data;
//           localStorage.setItem('accessToken', access_token);
//           useStore.getState().setToken(access_token);
          
//           // Retry the original request with new token
//           originalRequest.headers.Authorization = `Bearer ${access_token}`;
//           return apiClient(originalRequest);
//         }
//       } catch (refreshError) {
//         // Refresh failed, logout user
//         logoutUser(); // This could cause a circular dependency if logoutUser also uses apiClient
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

/**
 * Interface for the user object returned by the backend.
 */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  // Add any other user properties returned by your backend (e.g., profilePictureUrl, preferences, etc.)
}

/**
 * Interface for the authentication response from the backend.
 * Now includes both access and refresh tokens for persistent sessions.
 */
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: ApiUser;
  message?: string; // Optional message from backend (e.g., "Login successful")
}

/**
 * Interface for API error responses.
 */
interface ApiErrorResponse {
  message: string;
  error?: string; // Specific error code or type (e.g., "Validation Error", "Unauthorized")
  errors?: Array<{ field: string; message: string }>; // For validation errors
}

/**
 * Logs in a user.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A Promise resolving to the user object.
 * @throws An error if login fails.
 */
export const loginUser = async (email: string, password: string): Promise<ApiUser> => {
  try {
    const response = await apiClient.post<AuthResponse>( // Use apiClient
      `/auth/login`, // Endpoint is relative to baseURL, which already includes /api
      { email, password }
      // Headers and withCredentials are now handled by apiClient
    );
    const { user, access_token, refresh_token } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
    }
    useStore.getState().setToken(access_token);
    useStore.getState().setUser(user);
    // setAuthenticated is handled by setToken in the store

    return user;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>; // Type assertion
    if (axiosError.isAxiosError && axiosError.response) {
      const apiError = axiosError.response.data;
      throw new Error(apiError.message || 'Login failed. Please check your credentials.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred during login.');
    }
    throw new Error('An unexpected error occurred during login.');
  }
};

/**
 * Registers a new user.
 * @param name - The user's name.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A Promise resolving to the user object from AuthResponse.
 * @throws An error if registration fails.
 */
export const registerUser = async (name: string, email: string, password: string): Promise<ApiUser> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      `/auth/register`,
      { name, email, password }
    );
    const { user, access_token, refresh_token } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
    }
    useStore.getState().setToken(access_token);
    useStore.getState().setUser(user);
    // setAuthenticated is handled by setToken in the store

    return user;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>; // Type assertion
    if (axiosError.isAxiosError && axiosError.response) {
      const apiError = axiosError.response.data;
      throw new Error(apiError.message || 'Registration failed. Please try again.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred during registration.');
    }
    throw new Error('An unexpected error occurred during registration.');
  }
};

/**
 * Creates or retrieves a user based on OAuth information.
 * @param email - The user's email from OAuth provider.
 * @param name - The user's name from OAuth provider.
 * @param provider - The OAuth provider name (e.g., "google").
 * @param providerAccountId - The user's unique ID from the OAuth provider.
 * @returns A Promise resolving to the user object.
 * @throws An error if the process fails.
 */
export const createUserFromOAuth = async (
  email: string,
  name: string,
  provider: string,
  providerAccountId: string
): Promise<ApiUser> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/oauth-login", {
      email,
      name,
      provider,
      providerAccountId,
    });
    const { user, access_token, refresh_token } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
    }
    useStore.getState().setToken(access_token);
    useStore.getState().setUser(user);
    // setAuthenticated is handled by setToken in the store

    return user;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>; // Type assertion
    if (axiosError.isAxiosError && axiosError.response) {
      const apiError = axiosError.response.data;
      throw new Error(apiError.message || "OAuth user processing failed.");
    } else if (error instanceof Error) {
      throw new Error(error.message || "An unexpected error occurred during OAuth user processing.");
    }
    throw new Error("An unexpected error occurred during OAuth user processing.");
  }
};

/**
 * Logs out the current user.
 * Clears tokens from localStorage and Zustand store.
 * Calls backend logout endpoint to invalidate tokens.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to invalidate tokens
    await apiClient.post('/auth/logout'); 
    console.log('Successfully logged out from backend');
  } catch (error) {
    // Even if backend logout fails, proceed with client-side logout
    console.error('Backend logout failed, proceeding with client-side logout:', error);
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  useStore.getState().logout(); // This clears user, token, and isAuthenticated in Zustand
  console.log('User logged out, tokens removed, and Zustand store cleared.');
};

/**
 * Refreshes the access token using the refresh token.
 * @returns A Promise resolving to the new access token or throwing an error
 */
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });

    const { access_token } = response.data;
    localStorage.setItem('accessToken', access_token);
    useStore.getState().setToken(access_token);

    return access_token;
  } catch (error) {
    // Refresh failed, logout user
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    useStore.getState().logout();
    throw error;
  }
};

/**
 * Checks if the current session is valid and initializes user data
 * @returns A Promise that resolves when session check is complete
 */
export const checkSession = async (): Promise<void> => {
  try {
    const response = await apiClient.get('/auth/session-check');
    const { user } = response.data;
    useStore.getState().setUser(user);
  } catch (error) {
    console.error('Session check failed:', error);
    throw error;
  }
};

/**
 * Initializes the session on app load by checking for existing tokens
 * and validating the session with the backend
 */
export const initializeSession = async (): Promise<void> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      useStore.getState().setToken(accessToken);
      try {
        await checkSession();
        return;
      } catch (error) {
        // Access token might be expired, try refresh
        console.log('Access token expired, attempting refresh...');
      }
    }

    if (refreshToken) {
      await refreshAccessToken();
      // Session will be restored by the refresh function
      return;
    }
  } catch (error) {
    console.error('Session initialization failed:', error);
    // Clear invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    useStore.getState().logout();
  }
};

// Add other API service functions here (e.g., for fetching user profile, etc.)
