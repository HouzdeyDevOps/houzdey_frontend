export enum ReviewSentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

export enum ReviewCategory {
  COMMUNICATION = 'communication',
  PROFESSIONALISM = 'professionalism',
  RELIABILITY = 'reliability',
  KNOWLEDGE = 'knowledge',
  RESPONSIVENESS = 'responsiveness',
  OVERALL = 'overall'
}

export enum ReviewStatus {
  ACTIVE = 'active',
  HIDDEN = 'hidden',
  FLAGGED = 'flagged',
  DELETED = 'deleted'
}

export interface ReviewReply {
  id?: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  likes_count: number;
  liked_by: string[];
  user_name?: string;
  user_avatar?: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  
  // Review content
  rating: number;
  title?: string;
  content: string;
  sentiment: ReviewSentiment;
  categories: ReviewCategory[];
  
  // Context
  interaction_type?: string;
  property_id?: string;
  transaction_id?: string;
  
  // Status and moderation
  status: ReviewStatus;
  is_verified: boolean;
  is_anonymous: boolean;
  
  // Engagement
  likes_count: number;
  liked_by: string[];
  replies: ReviewReply[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  
  // User info (populated from API)
  reviewer_name?: string;
  reviewer_avatar?: string;
  
  // Moderation
  flagged_by: string[];
  flag_reasons: string[];
  moderated_at?: string;
  moderated_by?: string;
  moderation_notes?: string;
}

export interface ReviewSummary {
  user_id: string;
  total_reviews: number;
  average_rating: number;
  
  // Sentiment breakdown
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  
  // Rating distribution
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
  
  // Category ratings
  communication_rating: number;
  professionalism_rating: number;
  reliability_rating: number;
  knowledge_rating: number;
  responsiveness_rating: number;
  
  // Recent activity
  recent_reviews: Review[];
  
  // Metadata
  last_updated: string;
}

export interface CreateReviewRequest {
  reviewed_user_id: string;
  rating: number;
  title?: string;
  content: string;
  categories: ReviewCategory[];
  interaction_type?: string;
  property_id?: string;
  is_anonymous: boolean;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  categories?: ReviewCategory[];
}

export interface CreateReplyRequest {
  content: string;
}

export interface ReviewReportRequest {
  reason: string;
  description?: string;
}

export interface ReviewFilters {
  sentiment?: ReviewSentiment;
  rating?: number;
  category?: ReviewCategory;
  interaction_type?: string;
  is_verified?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ReviewResponse {
  reviews: Review[];
  pagination: {
    current_page: number;
    total_count: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number;
  };
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  category_averages: {
    [key in ReviewCategory]?: number;
  };
} 