"use client";

import { useState, useEffect } from 'react';
import { Star, MessageSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import axios from '@/lib/axios';

interface Review {
  id: string;
  rating: number;
  comment: string;
  content?: string; // API might use 'content' instead of 'comment'
  created_at: string;
  reviewer_name?: string;
  reviewed_user_name?: string;
  reviewer_avatar?: string;
  reviewed_user_avatar?: string;
  interaction_type: string;
  property_id?: string;
}

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    current_page: number;
    total_count: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export default function ProfileReviews() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (type: 'received' | 'given', page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`/reviews/my-reviews`, {
        params: {
          type,
          page,
          limit: 10
        }
      });
      
      // Handle different response formats
      let reviewsData: Review[] = [];
      let hasMoreData = false;
      
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          // If response is directly an array
          reviewsData = response.data;
          hasMoreData = response.data.length === 10;
        } else if (response.data.reviews && Array.isArray(response.data.reviews)) {
          // If response has reviews property
          reviewsData = response.data.reviews;
          hasMoreData = response.data.pagination?.has_next || false;
        } else {
          console.warn('Unexpected API response format:', response.data);
          reviewsData = [];
        }
      }
      
      if (page === 1) {
        setReviews(reviewsData);
      } else {
        setReviews(prev => [...prev, ...reviewsData]);
      }
      
      setHasMore(hasMoreData);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
      
      // If it's a 404 or empty response, just show empty state
      if (error.response?.status === 404 || error.response?.status === 400) {
        setReviews([]);
        setHasMore(false);
      } else {
        toast.error('Failed to load reviews');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentPage(1);
      setReviews([]); // Clear previous reviews when switching tabs
      fetchReviews(activeTab, 1);
    }
  }, [user, activeTab]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchReviews(activeTab, nextPage);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getInteractionTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'rental':
        return 'bg-blue-100 text-blue-800';
      case 'sale':
        return 'bg-green-100 text-green-800';
      case 'inquiry':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle error state
  if (error && !isLoading && reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to load reviews
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchReviews(activeTab, 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reviews Received
        </button>
        <button
          onClick={() => setActiveTab('given')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'given'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reviews Given
        </button>
      </div>

      {/* Reviews List */}
      {isLoading && reviews.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600">
            {activeTab === 'received' 
              ? "You haven't received any reviews yet." 
              : "You haven't written any reviews yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {activeTab === 'received' && review.reviewer_avatar ? (
                      <img
                        src={review.reviewer_avatar}
                        alt="Reviewer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : activeTab === 'given' && review.reviewed_user_avatar ? (
                      <img
                        src={review.reviewed_user_avatar}
                        alt="Reviewed user"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {activeTab === 'received' 
                        ? review.reviewer_name || 'Anonymous'
                        : review.reviewed_user_name || 'Anonymous'
                      }
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  {review.interaction_type && (
                    <span className={`px-2 py-1 text-xs rounded-full ${getInteractionTypeColor(review.interaction_type)}`}>
                      {review.interaction_type}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {review.content || review.comment || 'No comment provided'}
              </p>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 