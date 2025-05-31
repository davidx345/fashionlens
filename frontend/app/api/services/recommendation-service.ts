import axios, { AxiosError } from 'axios';
import apiClient from '../apiClient'; // Use the shared apiClient

// Interface for a single item within an outfit recommendation
export interface RecommendedItem {
  // Define based on what OutfitRecommender.generate_outfit_recommendations returns for items
  // Example fields:
  name: string;
  category: string;
  imageUrl?: string;
  // Add other relevant item details
}

// Interface for an outfit recommendation
export interface OutfitRecommendation {
  id: string; // Recommendation ID from the database
  name: string;
  description: string;
  image_url?: string; // Main image for the outfit recommendation
  items: RecommendedItem[]; // List of items that make up the outfit
  score?: number; // Overall score or match score for the recommendation
  // Add other fields like style, occasion, etc., if provided by the backend
}

interface ApiErrorResponse {
  message: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Fetches outfit recommendations for the current user.
 * @param count Optional number of recommendations to fetch.
 * @returns A promise that resolves with an array of outfit recommendations.
 */
export const getOutfitRecommendations = async (count?: number): Promise<OutfitRecommendation[]> => {
  try {
    const response = await apiClient.get<OutfitRecommendation[]>('/recommendations/outfits', {
      params: count ? { count } : {},
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      throw new Error(apiError.message || 'Failed to fetch outfit recommendations.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred while fetching recommendations.');
    } else {
      throw new Error('An unexpected error occurred. Please check your connection.');
    }
  }
};

/**
 * Submits feedback for a specific recommendation.
 * @param recommendationId The ID of the recommendation.
 * @param liked Boolean indicating if the user liked the recommendation.
 * @param comment Optional textual feedback from the user.
 * @returns A promise that resolves with a success message.
 */
export const submitRecommendationFeedback = async (
  recommendationId: string, 
  liked: boolean, 
  comment?: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>('/recommendations/feedback', {
      recommendationId,
      liked,
      comment,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      throw new Error(apiError.message || 'Failed to submit recommendation feedback.');
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred while submitting feedback.');
    } else {
      throw new Error('An unexpected error occurred. Please check your connection.');
    }
  }
};
