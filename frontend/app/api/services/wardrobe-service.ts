import axios, { AxiosError } from 'axios';
import apiClient from '../apiClient'; // Use the shared apiClient

export interface WardrobeItemData {
  name: string;
  category: string; // e.g., 'Top', 'Bottom', 'Shoes', 'Accessory'
  color?: string;
  season?: string; // e.g., 'Spring', 'Summer', 'Autumn', 'Winter'
  imageUrl?: string; // URL of the item image
  // Add other relevant fields like brand, material, purchaseDate, etc.
}

export interface WardrobeItem extends WardrobeItemData {
  _id: string; // MongoDB ObjectId
  user_id: string;
  created_at: string; // ISO date string
  image?: string; // Backend uses 'image' field for the image path
  imageUrl?: string; // Alternative field name for compatibility
}

interface ApiErrorResponse {
  message: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Fetches all wardrobe items for the current user.
 * @returns A promise that resolves with an array of wardrobe items.
 */
export const getWardrobeItems = async (): Promise<WardrobeItem[]> => {  try {
    // Use the shared apiClient which already includes /api in baseURL
    const response = await apiClient.get<WardrobeItem[]>('/wardrobe');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      throw new Error(apiError.message || 'Failed to fetch wardrobe items.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred while fetching wardrobe items.');
    } else {
      throw new Error('An unexpected error occurred. Please check your connection.');
    }
  }
};

/**
 * Adds a new item to the wardrobe.
 * @param itemData FormData containing the item details and image file.
 *                 The image file should be appended under the key 'image'.
 *                 Other fields (name, category, color, season) should also be appended.
 * @returns A promise that resolves with the newly created wardrobe item.
 */
export const addWardrobeItem = async (itemData: FormData): Promise<WardrobeItem> => {  try {
    // Use consistent prefix pattern without double /api
    const response = await apiClient.post<WardrobeItem>('/wardrobe', itemData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      throw new Error(apiError.message || 'Failed to add wardrobe item.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred while adding item.');
    } else {
      throw new Error('An unexpected error occurred. Please check your connection.');
    }
  }
};

/**
 * Deletes a wardrobe item by its ID.
 * @param itemId The ID of the item to delete.
 * @returns A promise that resolves with a success message or relevant data.
 */
export const deleteWardrobeItem = async (itemId: string): Promise<{ message: string }> => {  try {
    // Use consistent prefix pattern without double /api
    const response = await apiClient.delete<{ message: string }>(`/wardrobe/${itemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      throw new Error(apiError.message || 'Failed to delete wardrobe item.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred while deleting item.');
    } else {
      throw new Error('An unexpected error occurred. Please check your connection.');
    }
  }
};
