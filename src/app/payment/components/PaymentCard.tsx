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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
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
        const methods = {
            'credit_card': { 
                name: 'Tarjeta de Crédito',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                )
            },
            'debit_card': { 
                name: 'Tarjeta de Débito',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                )
            },
            'paypal': { 
                name: 'PayPal',
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.32 20.32c-.2 0-.4-.08-.55-.23L1.55 13.87c-.3-.3-.3-.79 0-1.09L7.77 6.55c.3-.3.79-.3 1.09 0s.3.79 0 1.09L3.73 12.78l5.13 5.13c.3.3.3.79 0 1.09-.15.15-.35.23-.55.23z"/>
                    </svg>
                )
            },
            'cash': { 
                name: 'Efectivo',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                )
            },
            'bank_transfer': { 
                name: 'Transferencia',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                )
            }
        };
        
        const methodData = methods[method.toLowerCase() as keyof typeof methods];
        return methodData || { name: method, icon: null };
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            {/* Header with Status Icon and Badge */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {formatAmount(payment.amount, payment.currency)}
                        </h3>
                        <p className="text-sm text-gray-500">
                            #{payment.id.toString().padStart(6, '0')}
                        </p>
                    </div>
                </div>
                
                <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                    ${getStatusColor(payment.status)}
                `}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()}
                </span>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
                {/* Payment Method */}
                <div className="flex items-center space-x-2">
                    {getPaymentMethodDisplay(payment.paymentMethod).icon && (
                        <div className="text-gray-600">
                            {getPaymentMethodDisplay(payment.paymentMethod).icon}
                        </div>
                    )}
                    <span className="text-sm text-gray-600">
                        {getPaymentMethodDisplay(payment.paymentMethod).name}
                    </span>
                    {payment.cardLastFour && (
                        <span className="text-xs text-gray-500">
                            •••• {payment.cardLastFour}
                        </span>
                    )}
                </div>

                {/* Date */}
                {payment.createdAt && (
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                            {formatDate(payment.createdAt)}
                        </span>
                    </div>
                )}

                {/* Transaction ID */}
                {payment.transactionId && (
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <span className="text-xs text-gray-500 font-mono">
                            {payment.transactionId}
                        </span>
                    </div>
                )}

                {/* Reservation ID */}
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm text-gray-600">
                        Reserva #{payment.reservationId}
                    </span>
                </div>
            </div>

            {/* Actions */}
            {showActions && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                        {onViewDetails && (
                            <button
                                onClick={() => onViewDetails(payment)}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Ver Detalles
                            </button>
                        )}
                        
                        {isAdmin && onRefund && payment.status.toLowerCase() === 'completed' && (
                            <button
                                onClick={() => onRefund(payment.id)}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
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
