// src/app/payment/types/payment.types.ts

export interface PaymentFormData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
    email: string;
}

export interface Payment {
    id: number;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal';
    transactionId?: string;
    reservationId: number;
    guestId: number;
    createdAt: string;
    updatedAt: string;
    
    // Datos de la tarjeta (solo los últimos 4 dígitos)
    cardLastFour?: string;
    cardBrand?: string;
}

export interface PaymentRequest {
    reservationId: number;
    amount: number;
    currency: string;
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal';
    cardDetails: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        cardHolderName: string;
    };
    billingInfo: {
        email: string;
    };
}

export interface PaymentResponse {
    success: boolean;
    payment?: Payment;
    transactionId?: string;
    error?: string;
    message?: string;
}

export interface PaymentHistory {
    payments: Payment[];
    total: number;
    page: number;
    totalPages: number;
}
