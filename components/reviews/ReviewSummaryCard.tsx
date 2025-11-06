"use client";

import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviews';

interface ReviewSummaryCardProps {
  userId: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ReviewSummaryCard({ 
  userId, 
  showDetails = true, 
  size = 'md',
  className = ''
}: ReviewSummaryCardProps) {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['review-summary', userId],
    queryFn: () => reviewsApi.getUserReviewSummary(userId),
    retry: false,
  });

  const sizeConfig = {
    sm: {
      star: 'w-3 h-3',
      text: 'text-xs',
      rating: 'text-sm font-medium',
      gap: 'gap-1'
    },
    md: {
      star: 'w-4 h-4',
      text: 'text-sm',
      rating: 'text-base font-medium',
      gap: 'gap-2'
    },
    lg: {
      star: 'w-5 h-5',
      text: 'text-base',
      rating: 'text-lg font-semibold',
      gap: 'gap-3'
    }
  };

  const config = sizeConfig[size];

  if (isLoading) {
    return (
      <div className={`flex items-center ${config.gap} ${className}`}>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className={`${config.star} bg-gray-200 rounded animate-pulse`} />
          ))}
        </div>
        <div className={`w-8 h-4 bg-gray-200 rounded animate-pulse`} />
      </div>
    );
  }

  if (!summary || summary.total_reviews === 0) {
    return (
      <div className={`flex items-center ${config.gap} text-gray-500 ${className}`}>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`${config.star} text-gray-300`} />
          ))}
        </div>
        <span className={config.text}>No reviews</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${config.star} ${
              star <= Math.round(summary.average_rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Rating and Count */}
      <div className="flex items-center gap-1">
        <span className={`${config.rating} text-gray-900`}>
          {summary.average_rating.toFixed(1)}
        </span>
        {showDetails && (
          <span className={`${config.text} text-gray-600`}>
            ({summary.total_reviews} review{summary.total_reviews !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  );
} 