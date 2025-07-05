// src/app/review/components/ReviewsList.tsx

import React from 'react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
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
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Stats Section */}
            {showStats && stats && stats.totalReviews > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Resumen de Reseñas
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Overall Rating */}
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {stats.averageRating.toFixed(1)}
                            </div>
                            <StarRating 
                                rating={stats.averageRating} 
                                size="lg" 
                                showValue={false}
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Basado en {stats.totalReviews} reseña{stats.totalReviews !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map(rating => {
                                const count = stats.ratingDistribution[rating.toString()] || 0;
                                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                
                                return (
                                    <div key={rating} className="flex items-center space-x-3">
                                        <span className="text-sm w-8">{rating}★</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
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
