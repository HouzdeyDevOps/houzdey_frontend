export interface PropertyView {
  id: string;
  property_id: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  referrer?: string;
  session_id: string;
  viewed_at: string;
  view_duration?: number;
}

export interface PropertyInquiry {
  id: string;
  property_id: string;
  user_id: string;
  inquiry_type: string;
  message?: string;
  phone_number?: string;
  preferred_contact_method?: string;
  created_at: string;
  status: string;
}

export interface PropertyAnalytics {
  property_id: string;
  property_title: string;
  property_type: string;
  listing_type: string;
  price: number;
  
  // View metrics
  total_views: number;
  unique_views: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
  
  // Engagement metrics
  total_inquiries: number;
  inquiries_today: number;
  inquiries_this_week: number;
  inquiries_this_month: number;
  conversion_rate: number;
  
  // Time metrics
  average_view_duration: number;
  bounce_rate: number;
  
  // Geographic data
  top_locations: Array<{ location: string; views: number }>;
  
  // Time series data
  daily_views: Array<{ date: string; views: number }>;
  daily_inquiries: Array<{ date: string; inquiries: number }>;
  
  // Comparison metrics
  similar_properties_avg_views: number;
  performance_rank: number;
  
  // Recommendations
  recommendations: string[];
  
  created_at: string;
}

export interface OwnerDashboardStats {
  owner_id: string;
  total_properties: number;
  active_properties: number;
  total_views: number;
  total_inquiries: number;
  total_messages: number;
  
  // Performance metrics
  best_performing_property?: {
    id: string;
    title: string;
    views: number;
    price: number;
  };
  average_views_per_property: number;
  average_inquiries_per_property: number;
  
  // Recent activity
  recent_views: Array<{
    property_title: string;
    viewed_at: string;
    user_id?: string;
  }>;
  recent_inquiries: Array<{
    property_title: string;
    created_at: string;
    inquiry_type: string;
  }>;
  
  // Trends
  views_trend: number;
  inquiries_trend: number;
  
  // Revenue insights
  estimated_monthly_revenue: number;
  
  created_at: string;
}

export interface MarketInsights {
  location: string;
  property_type: string;
  listing_type: string;
  
  // Market data
  average_price: number;
  price_trend: number;
  total_listings: number;
  active_listings: number;
  
  // Demand metrics
  average_views_per_listing: number;
  average_inquiries_per_listing: number;
  average_time_on_market: number;
  
  // Competition analysis
  similar_properties_count: number;
  price_position: string;
  
  // Recommendations
  suggested_price_range: {
    min: number;
    max: number;
  };
  market_recommendations: string[];
  
  created_at: string;
}

export enum AnalyticsTimeframe {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export interface PropertyPerformanceMetrics {
  property_id: string;
  timeframe: AnalyticsTimeframe;
  
  // Core metrics
  views: number;
  unique_visitors: number;
  inquiries: number;
  messages: number;
  phone_calls: number;
  
  // Engagement quality
  avg_session_duration: number;
  pages_per_session: number;
  bounce_rate: number;
  
  // Conversion funnel
  view_to_inquiry_rate: number;
  inquiry_to_message_rate: number;
  
  // Traffic sources
  traffic_sources: { [key: string]: number };
  
  // User demographics
  visitor_locations: { [key: string]: number };
  device_types: { [key: string]: number };
  
  // Time patterns
  peak_viewing_hours: number[];
  peak_viewing_days: string[];
  
  period_start: string;
  period_end: string;
  generated_at: string;
} 