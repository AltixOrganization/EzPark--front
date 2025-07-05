// src/app/review/pages/MyReviewsPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReview } from '../hooks/useReview';
import { useProfile } from '../../profile/hooks/useProfile';
import ReviewsList from '../components/ReviewsList';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const MyReviewsPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, loading: profileLoading } = useProfile();
    const {
        reviews,
        loading,
        updating,
        deleting,
        error,
        loadReviewsByProfile,
        updateReview,
        deleteReview,
        clearError
    } = useReview();

    useEffect(() => {
        if (profile?.id) {
            loadReviewsByProfile(profile.id);
        }
    }, [profile?.id, loadReviewsByProfile]);

    const handleUpdateReview = async (reviewId: number, formData: { rating: number; comment: string }): Promise<boolean> => {
        return await updateReview(reviewId, formData);
    };

    const handleDeleteReview = async (reviewId: number): Promise<boolean> => {
        return await deleteReview(reviewId);
    };

    if (profileLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Perfil no encontrado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Necesitas tener un perfil creado para ver tus reseñas.
                    </p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Crear Perfil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                    
                    <h1 className="text-3xl font-bold text-gray-900">
                        Mis Reseñas
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Todas las reseñas que has escrito
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
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

                {/* Stats */}
                {reviews.length > 0 && (
                    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Estadísticas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {reviews.length}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Total Reseñas
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Promedio Calificación
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {new Set(reviews.map(review => review.parkingId)).size}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Estacionamientos Calificados
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews List */}
                <ReviewsList
                    reviews={reviews}
                    currentProfileId={profile.id}
                    loading={updating || deleting}
                    onEdit={handleUpdateReview}
                    onDelete={handleDeleteReview}
                    emptyMessage="No has escrito ninguna reseña aún. ¡Visita algunos estacionamientos y comparte tu experiencia!"
                    showStats={false}
                />
            </div>
        </div>
    );
};

export default MyReviewsPage;
