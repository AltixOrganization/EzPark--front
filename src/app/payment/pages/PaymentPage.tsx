// src/app/payment/pages/PaymentPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { usePayment } from '../hooks/usePayment';
import type { PaymentFormData } from '../types/payment.types';
import type { Reservation } from '../../reservation/types/reservation.types';

const PaymentPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { processPayment, loading, error } = usePayment();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        // Obtener la reserva desde los parámetros de la URL o localStorage
        const reservationId = searchParams.get('reservationId');
        const reservationData = localStorage.getItem('pendingReservation');
        
        if (reservationData) {
            try {
                const parsedReservation = JSON.parse(reservationData);
                setReservation(parsedReservation);
            } catch (error) {
                console.error('Error parsing reservation data:', error);
                navigate('/reservations');
            }
        } else if (reservationId) {
            // TODO: Fetch reservation by ID from API
            navigate('/reservations');
        } else {
            navigate('/reservations');
        }
    }, [searchParams, navigate]);

    const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
        if (!reservation) return;

        const result = await processPayment(reservation, paymentData);
        
        if (result && result.success) {
            setPaymentSuccess(true);
            // Limpiar la reserva pendiente
            localStorage.removeItem('pendingReservation');
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                navigate('/reservations', { 
                    state: { message: 'Pago procesado exitosamente' }
                });
            }, 3000);
        }
    };

    const handleCancel = () => {
        navigate('/reservations');
    };

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="mb-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg
                                className="h-6 w-6 text-green-600"
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
                    <p className="text-gray-600 mb-6">
                        Tu reserva ha sido confirmada y el pago se ha procesado correctamente.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800">
                            <strong>Reserva #{reservation?.id}</strong><br />
                            Monto pagado: S/ {reservation?.totalFare.toFixed(2)}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Serás redirigido automáticamente en unos segundos...
                    </p>
                </div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando información de la reserva...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Completar Pago
                    </h1>
                    
                    {/* Resumen de la reserva */}
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Resumen de la reserva
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Reserva #:</span>
                                <span className="font-medium">{reservation.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Espacio:</span>
                                <span className="font-medium">{reservation.parking?.space || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fecha:</span>
                                <span className="font-medium">{reservation.reservationDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Horario:</span>
                                <span className="font-medium">
                                    {reservation.startTime} - {reservation.endTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duración:</span>
                                <span className="font-medium">{reservation.hoursRegistered}h</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total:</span>
                                <span className="text-blue-600">S/ {reservation.totalFare.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario de pago */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        Información de pago
                    </h2>
                    
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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

                    <PaymentForm
                        onSubmit={handlePaymentSubmit}
                        loading={loading}
                        reservationAmount={reservation.totalFare}
                    />

                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
