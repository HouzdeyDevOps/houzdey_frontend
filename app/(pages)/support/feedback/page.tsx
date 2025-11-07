"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { submitFeedback } from '@/api/support';
import { Star, Check, AlertCircle, Loader2, MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (feedback.trim().length < 10) {
      setError('Please provide at least 10 characters of feedback');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await submitFeedback({
        rating,
        comment: feedback,
        page_url: pathname,
        category: category || undefined,
      });

      setSuccess(true);
      setRating(0);
      setFeedback('');
      setCategory('');

      // Redirect to support home after 2 seconds
      setTimeout(() => {
        router.push('/support');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = [
    'Very Poor',
    'Poor',
    'Average',
    'Good',
    'Excellent'
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl font-semibold">Provide Feedback</h2>
      </div>
      <p className="text-gray-600 mb-8">
        We'd love to hear your thoughts! Your feedback helps us improve Houzdey for everyone.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Thank you for your feedback!</p>
            <p className="text-sm text-green-700 mt-1">
              Your input is valuable and helps us improve our services.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-4">
            How would you rate your experience? <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transform hover:scale-110 transition-transform"
                  disabled={isSubmitting || success}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-sm font-medium text-gray-700">
                {ratingLabels[(hoveredRating || rating) - 1]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category (Optional)
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            disabled={isSubmitting || success}
          >
            <option value="">Select a category</option>
            <option value="user_interface">User Interface</option>
            <option value="features">Features</option>
            <option value="performance">Performance</option>
            <option value="customer_service">Customer Service</option>
            <option value="property_listings">Property Listings</option>
            <option value="search_functionality">Search Functionality</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            What can we improve? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent min-h-[150px] resize-y"
            placeholder="Share your thoughts, suggestions, or concerns with us. We appreciate detailed feedback!"
            required
            disabled={isSubmitting || success}
            minLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters. {feedback.length > 0 && `(${feedback.length} characters)`}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || success || rating === 0}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : success ? (
            <>
              <Check className="w-5 h-5" />
              Submitted
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-900">
            <strong>Note:</strong> Your feedback may be shared anonymously to help improve our services.
            If you need direct support, please use the{' '}
            <a href="/support/submit-request" className="text-indigo-600 hover:underline font-medium">
              Submit a Request
            </a>{' '}
            form instead.
          </p>
        </div>
      </form>
    </div>
  );
} 