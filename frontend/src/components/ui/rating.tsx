'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  readonly value: number;
  readonly max?: number;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly showValue?: boolean;
  readonly interactive?: boolean;
  readonly onChange?: (rating: number) => void;
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
}: RatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (rating: number) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= Math.round(value);
        const isPartiallyFilled = ratingValue === Math.ceil(value) && value % 1 !== 0;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(ratingValue)}
            disabled={!interactive}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
            aria-label={`Rate ${ratingValue} out of ${max}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled && 'fill-amber-400 text-amber-400',
                !isFilled && 'fill-gray-200 text-gray-200'
              )}
            />
            {isPartiallyFilled && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(value % 1) * 100}%` }}
              >
                <Star className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />
              </div>
            )}
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm text-gray-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
