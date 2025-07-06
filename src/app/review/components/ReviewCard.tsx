// src/app/review/components/ReviewCard.tsx

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ProfileService, { type Profile } from '../../profile/services/profileService';
import type { Review } from '../types/review.types';

interface ReviewCardProps {
    review: Review;
    currentProfileId?: number;
    reviewerName?: string; // Nuevo prop opcional
    onEdit?: (reviewId: number, formData: { rating: number; comment: string }) => Promise<boolean>;
    onDelete?: (reviewId: number) => Promise<boolean>;
    showActions?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    currentProfileId,
    reviewerName,
    onEdit,
    onDelete,
    showActions = true
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reviewerProfile, setReviewerProfile] = useState<Profile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Debug logging
    console.log('ReviewCard - Debug:', {
        reviewId: review.id,
        reviewProfileId: review.profileId,
        currentProfileId,
        canEdit: currentProfileId === review.profileId,
        showActions,
        reviewerName
    });

    const canEdit = currentProfileId === review.profileId;
    const timeAgo = formatDistanceToNow(new Date(review.createdAt), { 
        addSuffix: true, 
        locale: es 
    });

    // Obtener información del perfil del reviewer solo si no se proporcionó reviewerName
    useEffect(() => {
        if (reviewerName) {
            // Si ya tenemos el nombre del reviewer, no necesitamos cargar el perfil
            return;
        }

        const loadReviewerProfile = async () => {
            if (!review.profileId) return;
            
            try {
                setLoadingProfile(true);
                const profile = await ProfileService.getProfileById(review.profileId);
                setReviewerProfile(profile);
            } catch (error) {
                console.error('Error al cargar perfil del reviewer:', error);
                // No establecer error, solo usar fallback
                setReviewerProfile(null);
            } finally {
                setLoadingProfile(false);
            }
        };

        loadReviewerProfile();
    }, [review.profileId, reviewerName]);

    const getReviewerDisplayName = () => {
        // Si se proporcionó reviewerName, usarlo directamente
        if (reviewerName) {
            return reviewerName;
        }

        if (loadingProfile) {
            return 'Cargando...';
        }
        
        if (reviewerProfile) {
            return `${reviewerProfile.firstName} ${reviewerProfile.lastName}`;
        }
        
        return `Usuario #${review.profileId}`;
    };

    const handleEdit = async (formData: { rating: number; comment: string }): Promise<boolean> => {
        if (onEdit) {
            const success = await onEdit(review.id, formData);
            if (success) {
                setIsEditing(false);
            }
            return success;
        }
        return false;
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
            setIsDeleting(true);
            if (onDelete) {
                await onDelete(review.id);
            }
            setIsDeleting(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Editar Reseña
                </h3>
                <ReviewForm
                    initialData={{
                        rating: review.rating,
                        comment: review.comment || ''
                    }}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    submitLabel="Actualizar"
                    loading={false}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {getReviewerDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">
                            {timeAgo}
                        </p>
                    </div>
                </div>
                
                {showActions && canEdit && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar reseña"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Eliminar reseña"
                        >
                            {isDeleting ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="mb-3">
                <StarRating rating={review.rating} size="md" />
            </div>

            {/* Comment */}
            {review.comment && (
                <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span>Reseña #{review.id}</span>
                {review.updatedAt !== review.createdAt && (
                    <span className="italic">
                        (editada)
                    </span>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
