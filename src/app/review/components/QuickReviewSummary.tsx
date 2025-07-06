// src/app/review/components/QuickReviewSummary.tsx

import React, { useEffect } from 'react';
import { useReview } from '../hooks/useReview';
import StarRating from './StarRating';

interface QuickReviewSummaryProps {
    parkingId: number;
    showDetails?: boolean;
    className?: string;
}

const QuickReviewSummary: React.FC<QuickReviewSummaryProps> = ({
    parkingId,
    showDetails = false,
    className = ""
}) => {
    const { stats, loadParkingStats } = useReview();

    useEffect(() => {
        loadParkingStats(parkingId);
    }, [parkingId, loadParkingStats]);

    if (!stats || stats.totalReviews === 0) {
        return (
            <div className={`text-xs text-gray-500 ${className}`}>
                Sin reseñas
            </div>
        );
    }

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <StarRating 
                rating={stats.averageRating} 
                size="sm" 
                showValue={false}
            />
            {showDetails ? (
                <div className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</span>
                    <span className="mx-1">·</span>
                    <span>{stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}</span>
                </div>
            ) : (
                <span className="text-xs text-gray-600 font-medium">
                    {stats.averageRating.toFixed(1)} ({stats.totalReviews})
                </span>
            )}
        </div>
    );
};

export default QuickReviewSummary;
