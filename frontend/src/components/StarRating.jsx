import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, onRatingChange, readOnly = true, size = 18 }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        return (
          <button
            type="button"
            key={star}
            disabled={readOnly}
            onClick={() => onRatingChange && onRatingChange(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} focus:outline-none`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
