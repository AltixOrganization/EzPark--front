// src/app/review/components/ReviewsList.tsx

import React from 'react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import useReviewerProfiles from '../hooks/useReviewerProfiles';
import type { Review, ReviewStats } from '../types/review.types';

interface ReviewsListProps {
    reviews: Review[];
    stats?: ReviewStats | null;
    currentProfileId?: number;
    loading?: boolean;
    onEdit?: (reviewId: number, formData: { rating: number; comment: string }) => Promise<boolean>;
    onDelete?: (reviewId: number) => Promise<boolean>;
    emptyMessage?: string;
    showStats?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
    reviews,
    stats,
    currentProfileId,
    loading = false,
    onEdit,
    onDelete,
    emptyMessage = "No hay reseñas disponibles",
    showStats = true
}) => {
    // Hook para cargar perfiles de reviewers
    const { getReviewerName } = useReviewerProfiles(reviews);

    // Debug logging
    console.log('ReviewsList - stats:', stats);
    console.log('ReviewsList - showStats:', showStats);
    console.log('ReviewsList - reviews.length:', reviews.length);
    console.log('ReviewsList - currentProfileId:', currentProfileId);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Enhanced Stats Section */}
            {showStats && reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Overall Rating Display */}
                        <div className="text-center lg:text-left">
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                                {stats ? stats.averageRating.toFixed(1) : (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                            </div>
                            <StarRating 
                                rating={stats ? stats.averageRating : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length} 
                                size="lg" 
                                showValue={false}
                            />
                            <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">
                                    Calificación promedio
                                </p>
                                <p className="text-xs text-gray-500">
                                    Basado en {stats ? stats.totalReviews : reviews.length} review{(stats ? stats.totalReviews : reviews.length) !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="lg:col-span-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-4">
                                Distribución de calificaciones
                            </h4>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map(rating => {
                                    let count = 0;
                                    let totalReviews = 0;
                                    
                                    if (stats && stats.ratingDistribution) {
                                        count = stats.ratingDistribution[rating.toString()] || 0;
                                        totalReviews = stats.totalReviews;
                                    } else {
                                        // Calculate from reviews data
                                        count = reviews.filter(r => r.rating === rating).length;
                                        totalReviews = reviews.length;
                                    }
                                    
                                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                    
                                    return (
                                        <div key={rating} className="flex items-center space-x-3">
                                            <span className="text-sm font-medium w-4 text-right">{rating}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                                <div 
                                                    className="bg-blue-500 h-3 rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 w-8 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Sin reseñas
                    </h3>
                    <p className="text-gray-600">
                        {emptyMessage}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Reseñas ({reviews.length})
                    </h3>
                    
                    {reviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            currentProfileId={currentProfileId}
                            reviewerName={getReviewerName(review.profileId)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsList;
