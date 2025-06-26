"use client";

import { useState } from 'react';
import { Star, MessageSquare, Plus } from 'lucide-react';
import UserReviews from '@/components/reviews/UserReviews';
import CreateReviewModal from '@/components/reviews/CreateReviewModal';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileReviewsProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  averageRating?: number;
  totalReviews?: number;
  canReview?: boolean; // Whether current user can write a review for this user
}

export default function UserProfileReviews({
  userId,
  userName,
  userAvatar,
  averageRating,
  totalReviews,
  canReview = false
}: UserProfileReviewsProps) {
  const [showCreateReview, setShowCreateReview] = useState(false);
  const { user: currentUser } = useAuth();

  // Don't allow users to review themselves
  const canWriteReview = canReview && currentUser && currentUser.id !== userId;

  return (
    <div className="space-y-6">
      {/* Header with rating summary and write review button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          
          {/* Rating Summary */}
          {averageRating && totalReviews && totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({totalReviews} reviews)</span>
            </div>
          )}
        </div>

        {/* Write Review Button */}
        {canWriteReview && (
          <button
            onClick={() => setShowCreateReview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Write Review
          </button>
        )}
      </div>

      {/* Reviews List */}
      <UserReviews userId={userId} userName={userName} />

      {/* Create Review Modal */}
      {showCreateReview && (
        <CreateReviewModal
          isOpen={showCreateReview}
          onClose={() => setShowCreateReview(false)}
          reviewedUserId={userId}
          reviewedUserName={userName}
          reviewedUserAvatar={userAvatar}
        />
      )}
    </div>
  );
} 