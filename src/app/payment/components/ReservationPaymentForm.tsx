// src/app/payment/components/ReservationPaymentForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import { usePayment } from '../hooks/usePayment';
import type { PaymentFormData } from '../types/payment.types';
import type { Reservation } from '../../reservation/types/reservation.types';

interface ReservationPaymentFormProps {
    reservation: Reservation;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ReservationPaymentForm: React.FC<ReservationPaymentFormProps> = ({
    reservation,
    onSuccess,
    onCancel
}) => {
    const navigate = useNavigate();
    const { processPayment, loading, error } = usePayment();
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
        const result = await processPayment(reservation, paymentData);
        
        if (result && result.success) {
            setPaymentSuccess(true);
            
            if (onSuccess) {
                onSuccess();
            } else {
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate('/my-reservations', { 
                        state: { message: 'Pago procesado exitosamente' }
                    });
                }, 2000);
            }
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate('/my-reservations');
        }
    };

    if (paymentSuccess) {
        return (
            <div className="text-center py-8">
                <div className="mb-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    ¡Pago exitoso!
                </h2>
                <p className="text-gray-600 mb-4">
                    Tu pago se ha procesado correctamente y tu reserva está confirmada.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800">
                        <strong>Reserva #{reservation.id}</strong><br />
                        Monto pagado: S/ {reservation.totalFare.toFixed(2)}
                    </p>
                </div>
                <p className="text-sm text-gray-500">
                    Redirigiendo automáticamente...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Información de la reserva */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Detalles de la reserva</h3>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Reserva:</strong> #{reservation.id}</p>
                    <p><strong>Fecha:</strong> {reservation.reservationDate}</p>
                    <p><strong>Horario:</strong> {reservation.startTime} - {reservation.endTime}</p>
                    <p><strong>Duración:</strong> {reservation.hoursRegistered} hora(s)</p>
                </div>
            </div>

            {/* Error de pago */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error en el pago</h3>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario de pago */}
            <PaymentForm
                onSubmit={handlePaymentSubmit}
                loading={loading}
                reservationAmount={reservation.totalFare}
            />

            {/* Botones de acción */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default ReservationPaymentForm;
