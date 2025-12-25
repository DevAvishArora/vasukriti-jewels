'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Rating } from '@/components/ui/rating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';

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

interface ReviewCardProps {
  readonly review: Review;
  readonly onHelpful?: () => void;
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleHelpful = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to mark as helpful');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(`/reviews/${review._id}/helpful`);
      const data = response.data.data;
      
      setHelpfulCount(data.helpful);
      setIsHelpful(data.markedByUser);
      toast.success(data.markedByUser ? 'Marked as helpful' : 'Removed from helpful');
      
      if (onHelpful) {
        onHelpful();
      }
    } catch (error) {
      console.error('Failed to mark as helpful:', error);
      toast.error('Failed to mark as helpful');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 pb-6 last:border-0"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900">{review.user.fullName}</span>
              {review.isVerifiedPurchase && (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Rating value={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="font-semibold text-gray-900">{review.title}</h4>
        )}

        {/* Comment */}
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {review.images.map((image) => (
              <div
                key={image}
                className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200"
              >
                <Image
                  src={image}
                  alt="Review image"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Admin Response */}
        {review.adminResponse && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 text-sm mb-1">
                  Response from {review.adminResponse.respondedBy.fullName}
                </p>
                <p className="text-gray-700 text-sm">{review.adminResponse.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Helpful Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={isSubmitting}
            className={isHelpful ? 'text-amber-600' : 'text-gray-600'}
          >
            <ThumbsUp className={`h-4 w-4 mr-2 ${isHelpful ? 'fill-amber-600' : ''}`} />
            Helpful {helpfulCount > 0 && `(${helpfulCount})`}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
