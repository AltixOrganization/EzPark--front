// src/app/review/pages/ParkingReviewsPage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewsManager from '../components/ReviewsManager';

const ParkingReviewsPage: React.FC = () => {
    const { parkingId } = useParams<{ parkingId: string }>();
    const navigate = useNavigate();

    if (!parkingId || isNaN(Number(parkingId))) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Estacionamiento no encontrado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        El ID del estacionamiento no es válido.
                    </p>
                    <button
                        onClick={() => navigate('/parkings')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Ver Estacionamientos
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
                        Reseñas del Estacionamiento
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Estacionamiento #{parkingId}
                    </p>
                </div>

                {/* Reviews Manager */}
                <ReviewsManager
                    parkingId={Number(parkingId)}
                    parkingName={`Estacionamiento #${parkingId}`}
                    allowNewReview={true}
                />
            </div>
        </div>
    );
};

export default ParkingReviewsPage;
