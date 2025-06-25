// src/app/reservation/pages/MyReservationsPage.tsx

import React, { useEffect, useState } from 'react';
import { useReservation } from '../hooks/useReservation';
import { usePayment } from '../../payment/hooks/usePayment';
import ReservationCard from '../components/ReservationCard';
import PaymentModal from '../../payment/components/PaymentModal';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Reservation } from '../types/reservation.types';
import type { PaymentFormData } from '../../payment/types/payment.types';

const MyReservationsPage: React.FC = () => {
    const { reservations, loading, error, loadMyReservations } = useReservation();
    const { 
        processPayment, 
        getPaymentByReservation,
        loading: paymentLoading,
        error: paymentError
    } = usePayment();
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [paymentStatuses, setPaymentStatuses] = useState<Record<number, 'none' | 'pending' | 'completed' | 'failed'>>({});

    useEffect(() => {
        loadMyReservations();
    }, [loadMyReservations]);

    // Verificar estado de pago para cada reservación aprobada
    useEffect(() => {
        const checkPaymentStatuses = async () => {
            const approvedReservations = reservations.filter(r => r.status === 'Approved');
            
            for (const reservation of approvedReservations) {
                if (!(reservation.id in paymentStatuses)) {
                    const payment = await getPaymentByReservation(reservation.id);
                    setPaymentStatuses(prev => ({
                        ...prev,
                        [reservation.id]: payment 
                            ? (payment.status === 'COMPLETED' ? 'completed' :
                               payment.status === 'PENDING' ? 'pending' : 
                               payment.status === 'FAILED' ? 'failed' :
                               payment.status === 'CANCELED' ? 'failed' : 'none')
                            : 'none'
                    }));
                }
            }
        };

        if (reservations.length > 0) {
            checkPaymentStatuses();
        }
    }, [reservations, getPaymentByReservation, paymentStatuses]);

    const handlePayReservation = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
        if (!selectedReservation) return;

        try {
            // Actualizar estado a pending
            setPaymentStatuses(prev => ({
                ...prev,
                [selectedReservation.id]: 'pending'
            }));

            const paymentResponse = await processPayment(selectedReservation, paymentData);
            
            if (paymentResponse && paymentResponse.success) {
                // Actualizar estado a completed
                setPaymentStatuses(prev => ({
                    ...prev,
                    [selectedReservation.id]: 'completed'
                }));

                setShowPaymentModal(false);
                setSelectedReservation(null);
                
                alert('🎉 ¡Pago procesado exitosamente! Tu reservación está confirmada.');
            } else {
                throw new Error(paymentResponse?.error || 'Error al procesar el pago');
            }
        } catch (error) {
            // Actualizar estado a failed
            setPaymentStatuses(prev => ({
                ...prev,
                [selectedReservation.id]: 'failed'
            }));
            
            console.error('Payment error:', error);
            alert('❌ Error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedReservation(null);
    };

    useEffect(() => {
        loadMyReservations();
    }, [loadMyReservations]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
                <p className="text-gray-600 mt-2">
                    Historial completo de tus reservaciones de estacionamiento
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {reservations.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes reservas aún
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Las reservas que hagas aparecerán aquí
                    </p>
                    <a 
                        href="/estacionamientos" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Buscar Estacionamientos
                    </a>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {reservations.map(reservation => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            showActions={true}
                            isHost={false}
                            onPayReservation={handlePayReservation}
                            paymentStatus={paymentStatuses[reservation.id] || 'none'}
                        />
                    ))}
                </div>
            )}

            {/* Modal de pago */}
            <PaymentModal
                isOpen={showPaymentModal}
                reservation={selectedReservation}
                onClose={handleClosePaymentModal}
                onSubmit={handlePaymentSubmit}
                loading={paymentLoading}
            />

            {/* Mostrar errores de pago */}
            {paymentError && (
                <div className="fixed bottom-4 right-4 max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>{paymentError}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReservationsPage;