import axios from '@/lib/axios';
import {
  PropertyAnalytics,
  OwnerDashboardStats,
  MarketInsights,
  PropertyPerformanceMetrics,
  AnalyticsTimeframe,
  PropertyInquiry
} from '@/@types/analytics';

export const analyticsApi = {
  // Track property view
  trackView: async (propertyId: string): Promise<{ status: string }> => {
    const response = await axios.post(`/analytics/track-view/${propertyId}`);
    return response.data;
  },

  // Get owner dashboard statistics
  getOwnerDashboard: async (): Promise<OwnerDashboardStats> => {
    const response = await axios.get('/analytics/owner/dashboard');
    return response.data;
  },

  // Get property analytics
  getPropertyAnalytics: async (
    propertyId: string,
    timeframe: AnalyticsTimeframe = AnalyticsTimeframe.MONTH
  ): Promise<PropertyAnalytics> => {
    const response = await axios.get(`/analytics/property/${propertyId}?timeframe=${timeframe}`);
    return response.data;
  },

  // Get market insights
  getMarketInsights: async (
    state: string,
    propertyType: string,
    listingType: string = 'rent'
  ): Promise<MarketInsights> => {
    const params = new URLSearchParams({
      state,
      property_type: propertyType,
      listing_type: listingType
    });
    
    const response = await axios.get(`/analytics/market-insights?${params.toString()}`);
    return response.data;
  },

  // Track property inquiry
  trackInquiry: async (data: {
    property_id: string;
    inquiry_type: string;
    message?: string;
    phone_number?: string;
    preferred_contact_method?: string;
  }): Promise<{ status: string; inquiry_id: string }> => {
    const response = await axios.post('/analytics/inquiry', data);
    return response.data;
  },

  // Get property performance metrics
  getPropertyPerformance: async (
    propertyId: string,
    timeframe: AnalyticsTimeframe
  ): Promise<PropertyPerformanceMetrics> => {
    const response = await axios.get(`/analytics/property/${propertyId}/performance?timeframe=${timeframe}`);
    return response.data;
  },
}; 