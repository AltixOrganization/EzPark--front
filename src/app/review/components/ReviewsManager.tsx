// src/app/review/components/ReviewsManager.tsx

import React, { useState, useEffect } from 'react';
import { useReview } from '../hooks/useReview';
import { useProfile } from '../../profile/hooks/useProfile';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import type { ReviewFormData } from '../types/review.types';

interface ReviewsManagerProps {
    parkingId: number;
    parkingName?: string;
    allowNewReview?: boolean;
}

const ReviewsManager: React.FC<ReviewsManagerProps> = ({
    parkingId,
    parkingName = "este estacionamiento",
    allowNewReview = true
}) => {
    const {
        reviews,
        stats,
        loading,
        creating,
        updating,
        deleting,
        error,
        loadReviewsByParking,
        loadParkingStats,
        createReview,
        updateReview,
        deleteReview,
        clearError
    } = useReview();

    const { profile: currentProfile } = useProfile();
    const [showAddForm, setShowAddForm] = useState(false);

    // Debug logging
    console.log('ReviewsManager - Current Profile Debug:', {
        currentProfile,
        currentProfileId: currentProfile?.id,
        isAuthenticated: !!currentProfile,
        parkingId
    });

    useEffect(() => {
        loadReviewsByParking(parkingId);
        loadParkingStats(parkingId);
    }, [parkingId, loadReviewsByParking, loadParkingStats]);

    // Verificar si el usuario ya tiene una reseña para este estacionamiento
    const userReview = currentProfile ? reviews.find(review => review.profileId === currentProfile.id) : null;
    const canAddReview = allowNewReview && currentProfile && !userReview;

    const handleCreateReview = async (formData: ReviewFormData): Promise<boolean> => {
        const success = await createReview(parkingId, formData);
        if (success) {
            setShowAddForm(false);
            // Recargar estadísticas después de crear
            loadParkingStats(parkingId);
        }
        return success;
    };

    const handleUpdateReview = async (reviewId: number, formData: ReviewFormData): Promise<boolean> => {
        const success = await updateReview(reviewId, formData);
        if (success) {
            // Recargar estadísticas después de actualizar
            loadParkingStats(parkingId);
        }
        return success;
    };

    const handleDeleteReview = async (reviewId: number): Promise<boolean> => {
        const success = await deleteReview(reviewId);
        if (success) {
            // Recargar estadísticas después de eliminar
            loadParkingStats(parkingId);
        }
        return success;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Reseñas y Calificaciones
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Opiniones sobre {parkingName}
                    </p>
                </div>

                {canAddReview && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>{showAddForm ? 'Cancelar' : 'Escribir Reseña'}</span>
                    </button>
                )}
            </div>

            {/* User's existing review notice */}
            {userReview && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Ya tienes una reseña para este estacionamiento. Puedes editarla o eliminarla desde la lista de reseñas.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Review Form */}
            {showAddForm && canAddReview && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Nueva Reseña
                    </h3>
                    <ReviewForm
                        onSubmit={handleCreateReview}
                        onCancel={() => setShowAddForm(false)}
                        loading={creating}
                    />
                </div>
            )}

            {/* Reviews List */}
            <ReviewsList
                reviews={reviews}
                stats={stats}
                currentProfileId={currentProfile?.id}
                loading={loading || updating || deleting}
                onEdit={handleUpdateReview}
                onDelete={handleDeleteReview}
                emptyMessage="No hay reseñas para este estacionamiento. ¡Sé el primero en escribir una!"
                showStats={true}
            />
        </div>
    );
};

export default ReviewsManager;
