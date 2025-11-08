import axios from '@/lib/axios';
import {
  Review,
  ReviewSummary,
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReplyRequest,
  ReviewReportRequest,
  ReviewFilters,
  ReviewResponse
} from '@/@types/reviews';

export const reviewsApi = {
  // Create a new review
  createReview: async (reviewData: CreateReviewRequest): Promise<{ message: string; review_id: string }> => {
    const response = await axios.post('/reviews/create', reviewData);
    return response.data;
  },

  // Get reviews for a specific user
  getUserReviews: async (userId: string, filters: ReviewFilters = {}): Promise<ReviewResponse> => {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await axios.get(`/reviews/user/${userId}?${params.toString()}`);
    return response.data;
  },

  // Get review summary for a user
  getUserReviewSummary: async (userId: string): Promise<ReviewSummary> => {
    const response = await axios.get(`/reviews/summary/${userId}`);
    return response.data;
  },

  // Get current user's reviews (received or given)
  getMyReviews: async (filters: {
    page?: number;
    limit?: number;
    type?: 'received' | 'given';
  } = {}): Promise<ReviewResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value) !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await axios.get(`/reviews/my-reviews?${params.toString()}`);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId: string, updateData: UpdateReviewRequest): Promise<{ message: string }> => {
    const response = await axios.put(`/reviews/${reviewId}`, updateData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Like or unlike a review
  likeReview: async (reviewId: string): Promise<{ message: string; liked: boolean }> => {
    const response = await axios.post(`/reviews/${reviewId}/like`);
    return response.data;
  },

  // Reply to a review
  replyToReview: async (reviewId: string, replyData: CreateReplyRequest): Promise<{ message: string }> => {
    const response = await axios.post(`/reviews/${reviewId}/reply`, replyData);
    return response.data;
  },

  // Report a review
  reportReview: async (reviewId: string, reportData: ReviewReportRequest): Promise<{ message: string }> => {
    const response = await axios.post(`/reviews/${reviewId}/report`, reportData);
    return response.data;
  },

  // Get user statistics for reviews
  getUserStats: async (userId: string): Promise<{
    total_reviews: number;
    average_rating: number;
    rating_distribution: { [key: number]: number };
    sentiment_distribution: { positive: number; neutral: number; negative: number };
  }> => {
    const summary = await reviewsApi.getUserReviewSummary(userId);
    
    return {
      total_reviews: summary.total_reviews,
      average_rating: summary.average_rating,
      rating_distribution: {
        1: summary.one_star_count,
        2: summary.two_star_count,
        3: summary.three_star_count,
        4: summary.four_star_count,
        5: summary.five_star_count
      },
      sentiment_distribution: {
        positive: summary.positive_count,
        neutral: summary.neutral_count,
        negative: summary.negative_count
      }
    };
  }
}; 