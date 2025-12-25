'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().max(100, 'Title must be less than 100 characters').optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  readonly productId: string;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  });

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await axiosInstance.post('/reviews', {
        product: productId,
        ...data,
      });

      toast.success('Review submitted successfully!', {
        description: 'Your review will be visible after approval.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error('Failed to submit review:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rating Selection */}
      <div>
        <Label className="block mb-2">Your Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors cursor-pointer',
                  (hoveredRating >= rating || selectedRating >= rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            </button>
          ))}
          {selectedRating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {selectedRating} out of 5
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
        )}
      </div>

      {/* Title (Optional) */}
      <div>
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Sum up your experience"
          className="mt-1"
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <Label htmlFor="comment">Your Review *</Label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="Share your thoughts about this product"
          rows={5}
          className="mt-1"
        />
        {errors.comment && (
          <p className="text-sm text-red-600 mt-1">{errors.comment.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Minimum 10 characters, maximum 1000 characters
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
