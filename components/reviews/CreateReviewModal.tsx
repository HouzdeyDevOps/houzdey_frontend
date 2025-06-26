"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Star, User as UserIcon } from 'lucide-react';
import { reviewsApi } from '@/api/reviews';
import { CreateReviewRequest, ReviewCategory } from '@/@types/reviews';
import { toast } from 'sonner';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewedUserId: string;
  reviewedUserName: string;
  reviewedUserAvatar?: string;
  propertyId?: string;
  interactionType?: string;
}

export default function CreateReviewModal({
  isOpen,
  onClose,
  reviewedUserId,
  reviewedUserName,
  reviewedUserAvatar,
  propertyId,
  interactionType
}: CreateReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ReviewCategory[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (reviewData: CreateReviewRequest) => reviewsApi.createReview(reviewData),
    onSuccess: () => {
      toast.success('Review created successfully');
      queryClient.invalidateQueries({ queryKey: ['user-reviews', reviewedUserId] });
      queryClient.invalidateQueries({ queryKey: ['review-summary', reviewedUserId] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create review');
    },
  });

  const categoryOptions = [
    { value: ReviewCategory.COMMUNICATION, label: 'Communication' },
    { value: ReviewCategory.PROFESSIONALISM, label: 'Professionalism' },
    { value: ReviewCategory.RELIABILITY, label: 'Reliability' },
    { value: ReviewCategory.KNOWLEDGE, label: 'Knowledge' },
    { value: ReviewCategory.RESPONSIVENESS, label: 'Responsiveness' },
    { value: ReviewCategory.OVERALL, label: 'Overall Experience' }
  ];

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setContent('');
    setSelectedCategories([]);
    setIsAnonymous(false);
    onClose();
  };

  const handleCategoryToggle = (category: ReviewCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please write a review');
      return;
    }

    const reviewData: CreateReviewRequest = {
      reviewed_user_id: reviewedUserId,
      rating,
      title: title.trim() || undefined,
      content: content.trim(),
      categories: selectedCategories,
      interaction_type: interactionType,
      property_id: propertyId,
      is_anonymous: isAnonymous
    };

    createMutation.mutate(reviewData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {reviewedUserAvatar ? (
              <img 
                src={reviewedUserAvatar} 
                alt={reviewedUserName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">Reviewing {reviewedUserName}</h3>
              <p className="text-sm text-gray-600">Share your experience working with this user</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && (
                  rating === 1 ? 'Poor' :
                  rating === 2 ? 'Fair' :
                  rating === 3 ? 'Good' :
                  rating === 4 ? 'Very Good' :
                  'Excellent'
                )}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell others about your experience with this user..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              maxLength={1000}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/1000 characters
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Categories (Optional)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Select the aspects you'd like to comment on
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategoryToggle(category.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedCategories.includes(category.value)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Post this review anonymously
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || rating === 0 || !content.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 