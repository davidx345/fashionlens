import axios, { AxiosError } from 'axios';

// Define the base URL for your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create an Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending/receiving cookies
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
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

// Interface for User Profile data
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
  // Add other profile fields as needed, e.g., profilePictureUrl, joinDate
}

// Interface for User Preferences
export interface UserPreferences {
  style?: string[];
  favoriteColors?: string[];
  // Add other preference fields
}

interface ApiErrorResponse {
  message: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Fetches the current user's profile.
 * @returns A promise that resolves with the user profile data.
 */
export const getUserProfile = async (): Promise<UserProfile> => {  try {
    const response = await apiClient.get<UserProfile>(`/api/user/profile`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      console.error('Error fetching user profile:', apiError.message || error.message);
      throw new Error(apiError.message || 'Failed to fetch user profile.');
    } else if (error instanceof Error) {
      console.error('An unexpected error occurred while fetching user profile:', error.message);
      throw new Error(error.message || 'An unexpected error occurred while fetching user profile.');
    } else {
      console.error('An unexpected error occurred while fetching user profile.');
      throw new Error('An unexpected error occurred while fetching user profile.');
    }
  }
};

/**
 * Updates the current user's profile.
 * @param profileData Partial data to update the user profile.
 * @returns A promise that resolves with the updated user profile data.
 */
export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {  try {
    const response = await apiClient.put<UserProfile>(`/api/user/profile`, profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      console.error('Error updating user profile:', apiError.message || error.message);
      throw new Error(apiError.message || 'Failed to update user profile.');
    } else if (error instanceof Error) {
      console.error('An unexpected error occurred while updating user profile:', error.message);
      throw new Error(error.message || 'An unexpected error occurred while updating user profile.');
    } else {
      console.error('An unexpected error occurred while updating user profile.');
      throw new Error('An unexpected error occurred while updating user profile.');
    }
  }
};

/**
 * Updates the current user's preferences.
 * @param preferencesData The user preferences data.
 * @returns A promise that resolves with the updated user preferences.
 */
export const updateUserPreferences = async (preferencesData: UserPreferences): Promise<UserPreferences> => {  try {
    const response = await apiClient.put<UserPreferences>(`/api/user/preferences`, preferencesData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      console.error('Error updating user preferences:', apiError.message || error.message);
      throw new Error(apiError.message || 'Failed to update user preferences.');
    } else if (error instanceof Error) {
      console.error('An unexpected error occurred while updating user preferences:', error.message);
      throw new Error(error.message || 'An unexpected error occurred while updating user preferences.');
    } else {
      console.error('An unexpected error occurred while updating user preferences.');
      throw new Error('An unexpected error occurred while updating user preferences.');
    }
  }
};
