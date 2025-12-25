'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { ReviewCard } from './review-card';
import { ReviewForm } from './review-form';
import { useAuthStore } from '@/store/auth-store';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';

interface Review {
  _id: string;
  user: {
    fullName: string;
  };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  helpfulBy?: string[];
  adminResponse?: {
    message: string;
    respondedBy: {
      fullName: string;
    };
    respondedAt: string;
  };
  createdAt: string;
}

interface ProductReviewsProps {
  readonly productId: string;
  readonly averageRating?: number;
  readonly totalReviews?: number;
}

export function ProductReviews({ productId, averageRating = 0, totalReviews = 0 }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState<{ [key: number]: number }>({});
  const [computedAverageRating, setComputedAverageRating] = useState(averageRating);
  const [computedTotalReviews, setComputedTotalReviews] = useState(totalReviews);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/reviews/product/${productId}?page=${page}&limit=10`);
      const data = response.data.data;

      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }

      setHasMore(data.pagination.current < data.pagination.pages);

      // Update total reviews count
      if (data.pagination?.total !== undefined) {
        setComputedTotalReviews(data.pagination.total);
      }

      // Calculate rating distribution and average
      const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;
      for (const review of data.reviews) {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        totalRating += review.rating;
      }
      setRatingDistribution(distribution);
      
      // Calculate average rating if we have reviews
      if (data.reviews.length > 0 && averageRating === 0) {
        setComputedAverageRating(totalRating / data.reviews.length);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowForm(false);
    setPage(1);
    loadReviews();
  };

  const calculatePercentage = (rating: number) => {
    if (computedTotalReviews === 0) return 0;
    return Math.round(((ratingDistribution[rating] || 0) / computedTotalReviews) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Overall Rating */}
          <div className="text-center md:border-r border-gray-200">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {computedAverageRating.toFixed(1)}
            </div>
            <Rating value={computedAverageRating} size="lg" />
            <p className="text-gray-600 mt-2">
              Based on {computedTotalReviews} {computedTotalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Right: Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-6">{rating}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${calculatePercentage(rating)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-10 text-right">
                  {calculatePercentage(rating)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {isAuthenticated && !showForm && (
        <div className="text-center">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Please{' '}
            <a href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              login
            </a>{' '}
            to write a review
          </p>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6 overflow-hidden"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Write Your Review
            </h3>
            <ReviewForm
              productId={productId}
              onSuccess={handleReviewSubmitted}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Customer Reviews
        </h3>

        {(() => {
          if (loading && page === 1) {
            return (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            );
          }

          if (reviews.length === 0) {
            return (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to review this product!
                </p>
                {isAuthenticated && !showForm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            );
          }

          return (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onHelpful={loadReviews}
                />
              ))}
            </div>
          );
        })()}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setPage((p) => p + 1)}
              variant="outline"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Reviews'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
