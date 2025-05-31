// frontend/app/api/services/dashboard-service.ts
import apiClient from '../apiClient'; // Corrected import path

export interface AnalyticsData {
  totalAnalyses: {
    value: number;
    trend: string;
  };
  wardrobeItems: {
    value: number;
    trend: string;
  };
  recommendationsViewed: {
    value: number;
    trend: string;
  };
  styleScoreAverage: {
    value: string;
    trend: string;
  };
}

export interface RecentActivity {
  description: string;
  time: string;
  type: 'analysis' | 'wardrobe' | 'profile';
}

export interface StyleTrendData {
  name: string;
  score: number;
  count: number;
}

class DashboardService {
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get('/dashboard/analytics'); // apiClient handles baseURL and auth headers
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error; // Or handle more gracefully
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await apiClient.get('/dashboard/recent-activity'); // apiClient handles baseURL and auth headers
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getStyleTrends(): Promise<StyleTrendData[]> {
    try {
      const response = await apiClient.get('/dashboard/style-trends'); // apiClient handles baseURL and auth headers
      return response.data;
    } catch (error) {
      console.error('Error fetching style trends:', error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
