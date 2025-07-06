// src/app/review/components/ReviewStatsCard.tsx

import React from 'react';
import StarRating from './StarRating';
import type { ReviewStats } from '../types/review.types';

interface ReviewStatsCardProps {
    stats: ReviewStats;
    className?: string;
}

const ReviewStatsCard: React.FC<ReviewStatsCardProps> = ({ stats, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">⭐</span>
                    {stats.averageRating.toFixed(1)}
                    <span className="ml-2 text-sm text-gray-600 font-normal">
                        ({stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''})
                    </span>
                </h3>
                <StarRating 
                    rating={stats.averageRating} 
                    size="sm" 
                    showValue={false}
                />
            </div>

            {/* Rating Distribution Bars */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Distribución de calificaciones
                </h4>
                {[5, 4, 3, 2, 1].map(rating => {
                    const count = stats.ratingDistribution[rating.toString()] || 0;
                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                    
                    return (
                        <div key={rating} className="flex items-center space-x-3 text-sm">
                            <span className="w-3 font-medium">{rating}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="w-6 text-right font-medium text-gray-700">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewStatsCard;
