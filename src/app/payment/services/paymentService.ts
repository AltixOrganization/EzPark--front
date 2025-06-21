// src/app/payment/services/paymentService.ts

import { apiService } from '../../shared/utils/api';
import type {
    PaymentRequest,
    PaymentResponse,
    Payment,
} from '../types/payment.types';

export class PaymentService {
    // Procesar pago de reserva
    static async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
        try {
            console.log('🔐 Checking current user authentication...');
            const token = localStorage.getItem('ezpark_token');
            const user = localStorage.getItem('ezpark_user');
            
            console.log('💳 Token exists:', !!token);
            console.log('👤 User exists:', !!user);
            
            if (user) {
                const parsedUser = JSON.parse(user);
                console.log('👤 User roles:', parsedUser.roles);
                console.log('👤 User ID:', parsedUser.id);
            }

            // Adaptamos los datos al formato que espera el backend
            const backendPayload = {
                amount: paymentData.amount,
                currency: "PEN", // Moneda por defecto
                status: "CANCELED", // Estado que solicitas
                paymentMethod: paymentData.paymentMethod.toUpperCase(),
                reservationId: paymentData.reservationId
            };

            console.log('💳 Payment payload:', backendPayload);
            console.log('🔍 Payload validation:');
            console.log('- amount:', backendPayload.amount, 'type:', typeof backendPayload.amount);
            console.log('- currency:', backendPayload.currency);
            console.log('- status:', backendPayload.status);
            console.log('- paymentMethod:', backendPayload.paymentMethod);
            console.log('- reservationId:', backendPayload.reservationId, 'type:', typeof backendPayload.reservationId);

            const response = await apiService.post<Payment>('/payments', backendPayload);
            console.log('✅ Payment response received:', response);
            
            // Adaptar la respuesta del backend al formato que espera el frontend
            const paymentResponse: PaymentResponse = {
                success: true,
                payment: response,
                message: 'Pago procesado exitosamente'
            };
            
            return paymentResponse;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    // Obtener todos los pagos
    static async getAllPayments(): Promise<Payment[]> {
        try {
            return await apiService.get<Payment[]>('/payments');
        } catch (error) {
            console.error('Error fetching all payments:', error);
            throw error;
        }
    }

    // Obtener historial de pagos del usuario (same as getAllPayments based on backend API)
    static async getPaymentHistory(): Promise<Payment[]> {
        try {
            return await apiService.get<Payment[]>('/payments');
        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error;
        }
    }

    // Obtener detalles de un pago
    static async getPayment(paymentId: number): Promise<Payment> {
        try {
            return await apiService.get<Payment>(`/payments/${paymentId}`);
        } catch (error) {
            console.error('Error fetching payment:', error);
            throw error;
        }
    }

    // Obtener pago de una reserva específica
    static async getPaymentByReservation(reservationId: number): Promise<Payment | null> {
        try {
            return await apiService.get<Payment>(`/payments?reservationId=${reservationId}`);
        } catch (error) {
            console.error('Error fetching payment by reservation:', error);
            return null;
        }
    }

    // Cancelar pago
    static async cancelPayment(paymentId: number): Promise<PaymentResponse> {
        try {
            return await apiService.post<PaymentResponse>(`/payments/${paymentId}/cancel`, {});
        } catch (error) {
            console.error('Error cancelling payment:', error);
            throw error;
        }
    }

    // Validar datos de tarjeta de crédito
    static validateCardNumber(cardNumber: string): boolean {
        // Algoritmo de Luhn para validar número de tarjeta
        const sanitized = cardNumber.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(sanitized)) return false;

        let sum = 0;
        let isEven = false;

        for (let i = sanitized.length - 1; i >= 0; i--) {
            let digit = parseInt(sanitized[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    static validateExpiryDate(expiryDate: string): boolean {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expiryDate)) return false;

        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expYear = parseInt(year);
        const expMonth = parseInt(month);

        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    }

    static validateCVV(cvv: string): boolean {
        return /^\d{3,4}$/.test(cvv);
    }

    static getCardBrand(cardNumber: string): string {
        const sanitized = cardNumber.replace(/\s/g, '');
        
        if (/^4/.test(sanitized)) return 'Visa';
        if (/^5[1-5]/.test(sanitized)) return 'Mastercard';
        if (/^3[47]/.test(sanitized)) return 'American Express';
        if (/^6(?:011|5)/.test(sanitized)) return 'Discover';
        
        return 'Unknown';
    }
}

export default PaymentService;