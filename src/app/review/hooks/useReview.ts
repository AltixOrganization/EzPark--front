// src/app/review/hooks/useReview.ts

import { useState, useCallback } from 'react';
import ReviewService from '../services/reviewService';
import { ProfileService } from '../../profile/services/profileService';
import type { 
    Review, 
    CreateReviewRequest, 
    UpdateReviewRequest,
    ReviewStats,
    ReviewFormData
} from '../types/review.types';

interface UseReviewReturn {
    // Estado
    reviews: Review[];
    currentReview: Review | null;
    stats: ReviewStats | null;
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: string | null;

    // Métodos CRUD
    loadAllReviews: (page?: number, size?: number) => Promise<void>;
    loadReviewsByParking: (parkingId: number, page?: number, size?: number) => Promise<void>;
    loadReviewsByProfile: (profileId: number) => Promise<void>;
    loadParkingStats: (parkingId: number) => Promise<void>;
    createReview: (parkingId: number, formData: ReviewFormData) => Promise<boolean>;
    updateReview: (reviewId: number, formData: ReviewFormData) => Promise<boolean>;
    deleteReview: (reviewId: number) => Promise<boolean>;
    getReviewById: (reviewId: number) => Promise<Review | null>;

    // Utilidades
    clearError: () => void;
    clearReviews: () => void;
    getAverageRating: () => number;
    canEditReview: (review: Review, currentProfileId: number) => boolean;
}

export const useReview = (): UseReviewReturn => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentReview, setCurrentReview] = useState<Review | null>(null);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todas las reseñas
    const loadAllReviews = useCallback(async (page: number = 0, size: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            
            const allReviews = await ReviewService.getAllReviews(page, size);
            setReviews(allReviews);
            
        } catch (err: any) {
            console.error('Error loading reviews:', err);
            setError(err.message || 'Error al cargar las reseñas');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar reseñas por estacionamiento
    const loadReviewsByParking = useCallback(async (parkingId: number, page: number = 0, size: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            
            const parkingReviews = await ReviewService.getReviewsByParking(parkingId, page, size);
            setReviews(parkingReviews);
            
        } catch (err: any) {
            console.error('Error loading parking reviews:', err);
            setError(err.message || 'Error al cargar las reseñas del estacionamiento');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar reseñas por perfil
    const loadReviewsByProfile = useCallback(async (profileId: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const profileReviews = await ReviewService.getReviewsByProfile(profileId);
            setReviews(profileReviews);
            
        } catch (err: any) {
            console.error('Error loading profile reviews:', err);
            setError(err.message || 'Error al cargar las reseñas del usuario');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar estadísticas del estacionamiento
    const loadParkingStats = useCallback(async (parkingId: number) => {
        try {
            setError(null);
            
            const parkingStats = await ReviewService.getParkingStats(parkingId);
            setStats(parkingStats);
            
        } catch (err: any) {
            console.error('Error loading parking stats:', err);
            setError(err.message || 'Error al cargar las estadísticas');
        }
    }, []);

    // Crear reseña
    const createReview = useCallback(async (parkingId: number, formData: ReviewFormData): Promise<boolean> => {
        try {
            setCreating(true);
            setError(null);

            // Obtener el profileId del usuario actual
            const profile = await ProfileService.getCurrentUserProfile();
            if (!profile) {
                throw new Error('No se pudo obtener el perfil del usuario');
            }

            const reviewData: CreateReviewRequest = {
                rating: formData.rating,
                comment: formData.comment || undefined,
                parkingId,
                profileId: profile.id
            };

            console.log('📝 Creating review with data:', reviewData);
            
            const newReview = await ReviewService.createReview(reviewData);
            setReviews(prev => [newReview, ...prev]);
            
            console.log('✅ Review created successfully');
            return true;
        } catch (err: any) {
            console.error('Error creating review:', err);
            setError(err.message || 'Error al crear la reseña');
            return false;
        } finally {
            setCreating(false);
        }
    }, []);

    // Actualizar reseña
    const updateReview = useCallback(async (reviewId: number, formData: ReviewFormData): Promise<boolean> => {
        try {
            setUpdating(true);
            setError(null);

            const updateData: UpdateReviewRequest = {
                rating: formData.rating,
                comment: formData.comment || undefined
            };

            console.log('🔄 Updating review with data:', updateData);
            
            const updatedReview = await ReviewService.updateReview(reviewId, updateData);
            setReviews(prev => prev.map(review => 
                review.id === reviewId ? updatedReview : review
            ));
            
            if (currentReview && currentReview.id === reviewId) {
                setCurrentReview(updatedReview);
            }
            
            console.log('✅ Review updated successfully');
            return true;
        } catch (err: any) {
            console.error('Error updating review:', err);
            setError(err.message || 'Error al actualizar la reseña');
            return false;
        } finally {
            setUpdating(false);
        }
    }, [currentReview]);

    // Eliminar reseña
    const deleteReview = useCallback(async (reviewId: number): Promise<boolean> => {
        try {
            setDeleting(true);
            setError(null);

            console.log('🗑️ Deleting review with ID:', reviewId);
            await ReviewService.deleteReview(reviewId);
            
            // Remover la reseña del estado local
            setReviews(prev => prev.filter(review => review.id !== reviewId));
            
            if (currentReview && currentReview.id === reviewId) {
                setCurrentReview(null);
            }
            
            console.log('✅ Review deleted successfully');
            return true;
        } catch (err: any) {
            console.error('Error deleting review:', err);
            setError(err.message || 'Error al eliminar la reseña');
            return false;
        } finally {
            setDeleting(false);
        }
    }, [currentReview]);

    // Obtener reseña por ID
    const getReviewById = useCallback(async (reviewId: number): Promise<Review | null> => {
        try {
            setError(null);
            const review = await ReviewService.getReviewById(reviewId);
            setCurrentReview(review);
            return review;
        } catch (err: any) {
            console.error('Error getting review by ID:', err);
            setError(err.message || 'Error al obtener la reseña');
            return null;
        }
    }, []);

    // Calcular promedio de calificaciones
    const getAverageRating = useCallback((): number => {
        if (reviews.length === 0) return 0;
        
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return Number((totalRating / reviews.length).toFixed(1));
    }, [reviews]);

    // Verificar si el usuario puede editar la reseña
    const canEditReview = useCallback((review: Review, currentProfileId: number): boolean => {
        return review.profileId === currentProfileId;
    }, []);

    // Limpiar error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Limpiar reseñas
    const clearReviews = useCallback(() => {
        setReviews([]);
        setCurrentReview(null);
        setStats(null);
    }, []);

    return {
        // Estado
        reviews,
        currentReview,
        stats,
        loading,
        creating,
        updating,
        deleting,
        error,

        // Métodos CRUD
        loadAllReviews,
        loadReviewsByParking,
        loadReviewsByProfile,
        loadParkingStats,
        createReview,
        updateReview,
        deleteReview,
        getReviewById,

        // Utilidades
        clearError,
        clearReviews,
        getAverageRating,
        canEditReview
    };
};

export default useReview;
