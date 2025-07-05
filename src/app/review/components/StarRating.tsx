// src/app/review/components/StarRating.tsx

import React from 'react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onRatingChange,
    showValue = false
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const handleStarClick = (starRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    const renderStar = (starIndex: number) => {
        const isFilled = starIndex <= rating;
        const isHalfFilled = starIndex === Math.ceil(rating) && rating % 1 !== 0;

        return (
            <button
                key={starIndex}
                type="button"
                disabled={!interactive}
                onClick={() => handleStarClick(starIndex)}
                className={`
                    ${sizeClasses[size]}
                    ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
                    ${interactive ? 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded' : ''}
                `}
            >
                {isHalfFilled ? (
                    <svg viewBox="0 0 24 24" className={sizeClasses[size]}>
                        <defs>
                            <linearGradient id={`half-${starIndex}`}>
                                <stop offset="50%" stopColor="#fbbf24" />
                                <stop offset="50%" stopColor="#d1d5db" />
                            </linearGradient>
                        </defs>
                        <path
                            fill={`url(#half-${starIndex})`}
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                    </svg>
                ) : (
                    <svg
                        fill={isFilled ? '#fbbf24' : '#d1d5db'}
                        stroke={isFilled ? '#fbbf24' : '#d1d5db'}
                        viewBox="0 0 24 24"
                        className={sizeClasses[size]}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                    </svg>
                )}
            </button>
        );
    };

    return (
        <div className="flex items-center space-x-1">
            <div className="flex">
                {Array.from({ length: maxRating }, (_, index) => renderStar(index + 1))}
            </div>
            {showValue && (
                <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
