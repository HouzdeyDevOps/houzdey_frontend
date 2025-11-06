"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Flag, 
  MoreHorizontal,
  Star,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { reviewsApi } from '@/api/reviews';
import { 
  Review, 
  ReviewSummary, 
  ReviewSentiment, 
  ReviewFilters,
  CreateReplyRequest 
} from '@/@types/reviews';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface UserReviewsProps {
  userId: string;
  userName: string;
}

interface ReviewCardProps {
  review: Review;
  onLike: (reviewId: string) => void;
  onReply: (reviewId: string, content: string) => void;
  onReport: (reviewId: string, reason: string) => void;
}

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const SentimentBadge = ({ sentiment }: { sentiment: ReviewSentiment }) => {
  const sentimentConfig = {
    [ReviewSentiment.POSITIVE]: {
      icon: ThumbsUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Positive'
    },
    [ReviewSentiment.NEUTRAL]: {
      icon: MessageCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      label: 'Neutral'
    },
    [ReviewSentiment.NEGATIVE]: {
      icon: ThumbsDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: 'Negative'
    }
  };

  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
};

const ReviewCard = ({ review, onLike, onReply, onReport }: ReviewCardProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(review.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.reviewer_avatar ? (
            <img 
              src={review.reviewer_avatar} 
              alt={review.reviewer_name || 'Anonymous'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.reviewer_name || 'Anonymous'}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              {review.is_edited && <span className="text-xs">(edited)</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          <SentimentBadge sentiment={review.sentiment} />
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onReport(review.id, 'inappropriate');
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {review.title && (
          <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
        )}
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
        
        {review.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {review.categories.map((category) => (
              <span 
                key={category}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {category.replace('_', ' ').toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onLike(review.id)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
          {review.likes_count > 0 && (
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              {review.likes_count}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowReplyForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleReplySubmit}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {review.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-100">
          {review.replies.map((reply, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">
                  {reply.user_name || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function UserReviews({ userId, userName }: UserReviewsProps) {
  const [filters, setFilters] = useState<ReviewFilters>({ page: 1, limit: 10 });
  const queryClient = useQueryClient();

  // Get review summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['review-summary', userId],
    queryFn: () => reviewsApi.getUserReviewSummary(userId),
    retry: false,
  });

  // Get reviews
  const { data: reviewsData, isLoading: reviewsLoading, error } = useQuery({
    queryKey: ['user-reviews', userId, filters],
    queryFn: () => reviewsApi.getUserReviews(userId, filters),
    retry: false,
  });

  // Like review mutation
  const likeMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsApi.likeReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reviews', userId] });
      toast.success('Review liked');
    },
    onError: () => {
      toast.error('Failed to like review');
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      reviewsApi.replyToReview(reviewId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reviews', userId] });
      toast.success('Reply added');
    },
    onError: () => {
      toast.error('Failed to add reply');
    },
  });

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason: string }) =>
      reviewsApi.reportReview(reviewId, { reason }),
    onSuccess: () => {
      toast.success('Review reported');
    },
    onError: () => {
      toast.error('Failed to report review');
    },
  });

  const handleLike = (reviewId: string) => {
    likeMutation.mutate(reviewId);
  };

  const handleReply = (reviewId: string, content: string) => {
    replyMutation.mutate({ reviewId, content });
  };

  const handleReport = (reviewId: string, reason: string) => {
    reportMutation.mutate({ reviewId, reason });
  };

  if (summaryLoading || reviewsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="bg-white rounded-lg border p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Feedback about {userName}
        </h2>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{summary.positive_count}</span>
              <span className="text-green-600 font-medium">Positive</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{summary.neutral_count}</span>
              <span className="text-orange-600 font-medium">Neutral</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{summary.negative_count}</span>
              <span className="text-red-600 font-medium">Negative</span>
            </div>
          </div>

          {summary.average_rating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(summary.average_rating)} size="md" />
              <span className="text-lg font-semibold">{summary.average_rating.toFixed(1)}</span>
              <span className="text-gray-600">({summary.total_reviews} reviews)</span>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div>
        {reviewsData?.reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to share your experience with {userName}.</p>
          </div>
        ) : (
          <>
            {reviewsData?.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={handleLike}
                onReply={handleReply}
                onReport={handleReport}
              />
            ))}

            {/* Pagination */}
            {reviewsData?.pagination && reviewsData.pagination.total_count > filters.limit! && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing {((filters.page! - 1) * filters.limit!) + 1} to{' '}
                  {Math.min(filters.page! * filters.limit!, reviewsData.pagination.total_count)} of{' '}
                  {reviewsData.pagination.total_count} reviews
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                    disabled={!reviewsData.pagination.has_prev}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                    disabled={!reviewsData.pagination.has_next}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 