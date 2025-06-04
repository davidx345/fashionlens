import axios from 'axios';
import apiClient from '../apiClient'; // Use the shared apiClient

// Interface for the core analysis results from the backend
export interface AnalysisResultData {
  overallScore: number;
  style: string; 
  colorHarmony: number; // Now 1-100 scale 
  fit: number; // Now 1-100 scale
  occasion: string[]; 
  bodyShape: string; 
  fabrics: string[]; 
  brands: string[]; 
  sustainability: { score: number; feedback: string }; // Now an object
  recommendations: string[]; 
  // Fields like patternClash, styleCohesion, suggestions, items might need to be re-evaluated
  // based on the actual GeminiAnalyzer output if the above is not exhaustive.
  // For now, focusing on the user-provided list.
  patternClash?: boolean; // Optional, if still relevant
  styleCohesion?: string; // Optional, if still relevant
  suggestions?: string[]; // Optional, if still relevant
  items?: Array<{ // Optional, if still relevant
    category: string; 
    description: string; 
    colors: string[]; 
    styleNotes: string; 
  }>;
}

// Interface for the response from the POST /analysis/upload endpoint
export interface UploadAnalysisResponse {
  id: string; // The ID of the created analysis record
  images: string[]; // Public URLs of the uploaded images
  results: AnalysisResultData; // The core analysis results
}

// Interface for frontend usage that includes additional UI properties
export interface AnalysisResult extends UploadAnalysisResponse {
  fileName?: string; // Added by frontend for UI display
  imageUrl?: string; // Added by frontend for preview
}

// Interface for a stored analysis document (e.g., from history or get by ID)
export interface StoredAnalysis extends UploadAnalysisResponse {
  _id: string; // MongoDB ObjectId
  user_id: string;
  created_at: string; // ISO date string
  // images and results are inherited from UploadAnalysisResponse
}

interface ApiErrorResponse {
  message: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Service function to analyze an outfit by uploading an image.
 * @param imageFile The image file of the outfit to analyze.
 * @returns A promise that resolves with the analysis ID, image URLs, and results.
 */
export const analyzeOutfit = async (imageFile: File): Promise<UploadAnalysisResponse> => {
  const formData = new FormData();
  formData.append('images', imageFile, imageFile.name);
  try {
    // Use relative path since apiClient baseURL already includes /api
    const response = await apiClient.post<UploadAnalysisResponse>('/analysis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      console.error('Error analyzing outfit:', apiError.message || error.message);
      throw new Error(apiError.message || 'Failed to analyze outfit. Please try again.');
    } else if (error instanceof Error) {
      console.error('An unexpected error occurred during outfit analysis:', error.message);
      throw new Error(error.message || 'An unexpected error occurred during outfit analysis.');
    } else {
      console.error('An unexpected error occurred during outfit analysis.');
      throw new Error('An unexpected error occurred during outfit analysis. Please check your connection.');
    }
  }
};

/**
 * Fetches a specific analysis by its ID.
 * @param analysisId The ID of the analysis to fetch.
 * @returns A promise that resolves with the stored analysis data.
 */
export const getAnalysisById = async (analysisId: string): Promise<StoredAnalysis> => {
  try {
    const response = await apiClient.get<StoredAnalysis>(`/analysis/${analysisId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      console.error(`Error fetching analysis ${analysisId}:`, apiError.message || error.message);
      throw new Error(apiError.message || `Failed to fetch analysis ${analysisId}.`);
    } else if (error instanceof Error) {
      console.error('An unexpected error occurred while fetching analysis:', error.message);
      throw new Error(error.message || 'An unexpected error occurred while fetching analysis.');
    } else {
      console.error('An unexpected error occurred while fetching analysis.');
      throw new Error('An unexpected error occurred while fetching analysis.');
    }
  }
};

/**
 * Fetches the analysis history for the current user.
 * @param limit Optional limit for the number of history items to fetch.
 * @returns A promise that resolves with an array of stored analysis data.
 */
export const getAnalysisHistory = async (limit?: number): Promise<StoredAnalysis[]> => {
  try {
    const response = await apiClient.get<StoredAnalysis[]>('/analysis/history', {
      params: limit ? { limit } : {},
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiErrorResponse;
      console.error('Error fetching analysis history:', apiError.message || error.message);
      throw new Error(apiError.message || 'Failed to fetch analysis history.');
    } else if (error instanceof Error) {
      console.error('An unexpected error occurred while fetching analysis history:', error.message);
      throw new Error(error.message || 'An unexpected error occurred while fetching analysis history.');
    } else {
      console.error('An unexpected error occurred while fetching analysis history.');
      throw new Error('An unexpected error occurred while fetching analysis history.');
    }
  }
};
