// src/app/payment/components/PaymentCard.tsx

import React from 'react';
import type { Payment } from '../types/payment.types';

interface PaymentCardProps {
    payment: Payment;
    showActions?: boolean;
    onViewDetails?: (payment: Payment) => void;
    onRefund?: (paymentId: number) => void;
    isAdmin?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
    payment,
    showActions = false,
    onViewDetails,
    onRefund,
    isAdmin = false
}) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'pending':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount: number, currency: string = 'PEN') => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const getPaymentMethodDisplay = (method: string) => {
        switch (method.toLowerCase()) {
            case 'credit_card':
                return 'Tarjeta de Crédito';
            case 'debit_card':
                return 'Tarjeta de Débito';
            case 'paypal':
                return 'PayPal';
            default:
                return method;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Pago #{payment.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Reserva #{payment.reservationId}
                    </p>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1 capitalize">{payment.status}</span>
                </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Monto:</span>
                    <span className="text-lg font-bold text-gray-900">
                        {formatAmount(payment.amount, payment.currency)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Método de pago:</span>
                    <span className="text-sm text-gray-900">
                        {getPaymentMethodDisplay(payment.paymentMethod)}
                    </span>
                </div>

                {payment.cardLastFour && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Tarjeta:</span>
                        <span className="text-sm text-gray-900">
                            {payment.cardBrand} ****{payment.cardLastFour}
                        </span>
                    </div>
                )}

                {payment.transactionId && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">ID Transacción:</span>
                        <span className="text-sm text-gray-600 font-mono">
                            {payment.transactionId}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Fecha:</span>
                    <span className="text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            {showActions && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        {onViewDetails && (
                            <button
                                onClick={() => onViewDetails(payment)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                Ver Detalles
                            </button>
                        )}
                        
                        {onRefund && payment.status === 'completed' && isAdmin && (
                            <button
                                onClick={() => onRefund(payment.id)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                            >
                                Reembolsar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentCard;
