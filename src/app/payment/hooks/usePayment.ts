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
                paymentMethod: 'credit_card',
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
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al procesar el pago';
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
            const allPayments = await PaymentService.getAllPayments();
            setPayments(allPayments);
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
            const history = await PaymentService.getPaymentHistory();
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
                        ? { ...payment, status: 'cancelled' as const }
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
