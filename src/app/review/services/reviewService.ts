// src/app/review/services/reviewService.ts

import { apiService } from '../../shared/utils/api';
import type { 
    Review, 
    CreateReviewRequest, 
    UpdateReviewRequest,
    ReviewStats
} from '../types/review.types';

export class ReviewService {
    private static readonly BASE_PATH = '/api/reviews';

    /**
     * Create a new review
     */
    static async createReview(reviewData: CreateReviewRequest): Promise<Review> {
        try {
            console.log('📤 Creating review:', reviewData);
            const response = await apiService.post<Review>(this.BASE_PATH, reviewData);
            console.log('✅ Review created:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error creating review:', error);
            
            if (error.message.includes('409')) {
                throw new Error('Ya tienes una reseña para este estacionamiento');
            }
            if (error.message.includes('404')) {
                throw new Error('Estacionamiento o perfil no encontrado');
            }
            if (error.message.includes('400')) {
                throw new Error('Datos de la reseña inválidos');
            }
            
            throw new Error(error.message || 'Error al crear la reseña');
        }
    }

    /**
     * Get all reviews
     */
    static async getAllReviews(page: number = 0, size: number = 10, sort: string = 'createdAt'): Promise<Review[]> {
        try {
            console.log('📤 Getting all reviews');
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sort
            });
            
            const response = await apiService.get<Review[]>(`${this.BASE_PATH}?${queryParams}`);
            console.log('✅ Reviews obtained:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error getting reviews:', error);
            throw new Error(error.message || 'Error al obtener las reseñas');
        }
    }

    /**
     * Get review by ID
     */
    static async getReviewById(reviewId: number): Promise<Review> {
        try {
            console.log(`📤 Getting review with ID: ${reviewId}`);
            const response = await apiService.get<Review>(`${this.BASE_PATH}/${reviewId}`);
            console.log('✅ Review obtained:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error getting review:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Reseña no encontrada');
            }
            
            throw new Error(error.message || 'Error al obtener la reseña');
        }
    }

    /**
     * Get reviews by parking ID
     */
    static async getReviewsByParking(parkingId: number, page: number = 0, size: number = 10): Promise<Review[]> {
        try {
            console.log(`📤 Getting reviews for parking: ${parkingId}`);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });
            
            const response = await apiService.get<Review[]>(`${this.BASE_PATH}/parking/${parkingId}?${queryParams}`);
            console.log('✅ Parking reviews obtained:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error getting parking reviews:', error);
            throw new Error(error.message || 'Error al obtener las reseñas del estacionamiento');
        }
    }

    /**
     * Get reviews by profile ID
     */
    static async getReviewsByProfile(profileId: number): Promise<Review[]> {
        try {
            console.log(`📤 Getting reviews for profile: ${profileId}`);
            const response = await apiService.get<Review[]>(`${this.BASE_PATH}/profile/${profileId}`);
            console.log('✅ Profile reviews obtained:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error getting profile reviews:', error);
            throw new Error(error.message || 'Error al obtener las reseñas del usuario');
        }
    }

    /**
     * Get parking statistics
     */
    static async getParkingStats(parkingId: number): Promise<ReviewStats> {
        try {
            console.log(`📤 Getting stats for parking: ${parkingId}`);
            const response = await apiService.get<ReviewStats>(`${this.BASE_PATH}/parking/${parkingId}/stats`);
            console.log('✅ Parking stats obtained:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error getting parking stats:', error);
            throw new Error(error.message || 'Error al obtener las estadísticas del estacionamiento');
        }
    }

    /**
     * Update review
     */
    static async updateReview(reviewId: number, reviewData: UpdateReviewRequest): Promise<Review> {
        try {
            console.log(`📤 Updating review ${reviewId}:`, reviewData);
            const response = await apiService.put<Review>(`${this.BASE_PATH}/${reviewId}`, reviewData);
            console.log('✅ Review updated:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error updating review:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Reseña no encontrada');
            }
            if (error.message.includes('403')) {
                throw new Error('Solo puedes modificar tus propias reseñas');
            }
            if (error.message.includes('400')) {
                throw new Error('Datos de la reseña inválidos');
            }
            
            throw new Error(error.message || 'Error al actualizar la reseña');
        }
    }

    /**
     * Delete review
     */
    static async deleteReview(reviewId: number): Promise<void> {
        try {
            console.log(`📤 Deleting review with ID: ${reviewId}`);
            await apiService.delete(`${this.BASE_PATH}/${reviewId}`);
            console.log('✅ Review deleted successfully');
        } catch (error: any) {
            console.error('❌ Error deleting review:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Reseña no encontrada');
            }
            if (error.message.includes('403')) {
                throw new Error('Solo puedes eliminar tus propias reseñas');
            }
            
            throw new Error(error.message || 'Error al eliminar la reseña');
        }
    }
}

export default ReviewService;
