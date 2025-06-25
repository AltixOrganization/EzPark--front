// src/app/payment/hooks/usePayment.ts

import { useState } from 'react';
import PaymentService from '../services/paymentService';
import type { PaymentFormData, PaymentRequest, PaymentResponse, Payment } from '../types/payment.types';
import type { Reservation } from '../../reservation/types/reservation.types';

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);

    const processPayment = async (
        reservation: Reservation,
        paymentData: PaymentFormData
    ): Promise<PaymentResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const paymentRequest: PaymentRequest = {
                reservationId: reservation.id,
                amount: reservation.totalFare,
                currency: 'PEN', // Soles peruanos
                paymentMethod: 'CREDIT_CARD',
                cardDetails: {
                    cardNumber: paymentData.cardNumber,
                    expiryDate: paymentData.expiryDate,
                    cvv: paymentData.cvv,
                    cardHolderName: paymentData.cardHolderName,
                },
                billingInfo: {
                    email: paymentData.email,
                }
            };

            const response = await PaymentService.processPayment(paymentRequest);
            
            if (response.success) {
                return response;
            } else {
                setError(response.error || 'Error al procesar el pago');
                return null;
            }
        } catch (err) {
            let errorMessage = 'Error desconocido al procesar el pago';
            
            if (err instanceof Error) {
                // Manejar errores específicos
                if (err.message.includes('503') || err.message.includes('Service Unavailable')) {
                    errorMessage = 'El servicio de pagos no está disponible temporalmente. Por favor, inténtalo de nuevo en unos minutos.';
                } else if (err.message.includes('ERR_COMM_001')) {
                    errorMessage = 'Los servicios de pago externos no están disponibles. Por favor, inténtalo más tarde.';
                } else if (err.message.includes('400')) {
                    errorMessage = 'Datos de pago inválidos. Por favor, verifica la información ingresada.';
                } else if (err.message.includes('401')) {
                    errorMessage = 'No estás autorizado para realizar esta acción. Por favor, inicia sesión nuevamente.';
                } else if (err.message.includes('500')) {
                    errorMessage = 'Error interno del servidor. Por favor, contacta al soporte técnico.';
                } else {
                    errorMessage = err.message;
                }
            }
            
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loadMyPayments = async () => {
        setLoading(true);
        setError(null);

        try {
            const myPayments = await PaymentService.getMyPayments();
            setPayments(myPayments);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener los pagos';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getPaymentHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const history = await PaymentService.getMyPayments();
            return history;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener el historial de pagos';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getPaymentByReservation = async (reservationId: number) => {
        setLoading(true);
        setError(null);

        try {
            const payment = await PaymentService.getPaymentByReservation(reservationId);
            return payment;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener el pago de la reserva';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const processRefund = async (paymentId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await PaymentService.cancelPayment(paymentId);
            
            if (response.success) {
                // Actualizar el estado local del pago
                setPayments(prev => prev.map(payment => 
                    payment.id === paymentId 
                        ? { ...payment, status: 'CANCELED' as const }
                        : payment
                ));
                return response;
            } else {
                setError(response.error || 'Error al procesar el reembolso');
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al procesar el reembolso';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        loading,
        error,
        payments,
        processPayment,
        loadMyPayments,
        getPaymentHistory,
        getPaymentByReservation,
        processRefund,
        clearError,
    };
};

export default usePayment;
