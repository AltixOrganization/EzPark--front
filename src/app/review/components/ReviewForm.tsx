// src/app/review/components/ReviewForm.tsx

import React, { useState } from 'react';
import StarRating from './StarRating';
import type { ReviewFormData } from '../types/review.types';

interface ReviewFormProps {
    onSubmit: (formData: ReviewFormData) => Promise<boolean>;
    onCancel?: () => void;
    initialData?: Partial<ReviewFormData>;
    submitLabel?: string;
    loading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    submitLabel = 'Enviar Reseña',
    loading = false
}) => {
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: initialData?.rating || 5,
        comment: initialData?.comment || ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.rating < 1 || formData.rating > 5) {
            alert('Por favor selecciona una calificación válida (1-5 estrellas)');
            return;
        }

        try {
            setSubmitting(true);
            const success = await onSubmit(formData);
            
            if (success && !initialData) {
                // Solo limpiar el formulario si es una nueva reseña
                setFormData({
                    rating: 5,
                    comment: ''
                });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const comment = e.target.value;
        if (comment.length <= 500) {
            setFormData(prev => ({ ...prev, comment }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación *
                </label>
                <div className="flex items-center space-x-3">
                    <StarRating
                        rating={formData.rating}
                        interactive={true}
                        onRatingChange={handleRatingChange}
                        size="lg"
                    />
                    <span className="text-sm text-gray-600">
                        {formData.rating} de 5 estrellas
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Haz clic en las estrellas para calificar
                </p>
            </div>

            {/* Comment */}
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario (opcional)
                </label>
                <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={handleCommentChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Comparte tu experiencia con este estacionamiento..."
                />
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                        Máximo 500 caracteres
                    </p>
                    <p className={`text-xs ${formData.comment.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                        {formData.comment.length}/500
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting || loading}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={submitting || loading || formData.rating === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    {(submitting || loading) ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Enviando...</span>
                        </>
                    ) : (
                        <span>{submitLabel}</span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
