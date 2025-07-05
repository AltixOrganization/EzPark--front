// src/app/review/types/review.types.ts

export interface Review {
    id: number;
    rating: number;
    comment?: string;
    parkingId: number;
    profileId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewRequest {
    rating: number;
    comment?: string;
    parkingId: number;
    profileId: number;
}

export interface UpdateReviewRequest {
    rating: number;
    comment?: string;
}

export interface ReviewStats {
    parkingId: number;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        [key: string]: number;
    };
}

export interface ReviewFormData {
    rating: number;
    comment: string;
}

export interface ReviewError {
    code: string;
    message: string;
    details?: string[];
    timestamp: string;
}
