// src/app/payment/components/PaymentMethodCards.tsx

import React from 'react';
import type { Payment } from '../types/payment.types';

type PaymentMethod = Payment['paymentMethod'];

interface PaymentMethodCardsProps {
    selectedMethod: PaymentMethod | null;
    onMethodSelect: (method: PaymentMethod) => void;
    disabled?: boolean;
}

const PaymentMethodCards: React.FC<PaymentMethodCardsProps> = ({
    selectedMethod,
    onMethodSelect,
    disabled = false
}) => {
    const paymentMethods = [
        {
            key: 'CREDIT_CARD' as PaymentMethod,
            title: 'Tarjeta de Crédito',
            description: 'Visa, Mastercard, Amex',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            color: 'blue',
            popular: true
        },
        {
            key: 'DEBIT_CARD' as PaymentMethod,
            title: 'Tarjeta de Débito',
            description: 'Pago directo desde tu cuenta',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            color: 'green'
        },
        {
            key: 'PAYPAL' as PaymentMethod,
            title: 'PayPal',
            description: 'Pago seguro con PayPal',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.32 20.32c-.2 0-.4-.08-.55-.23L1.55 13.87c-.3-.3-.3-.79 0-1.09L7.77 6.55c.3-.3.79-.3 1.09 0s.3.79 0 1.09L3.73 12.78l5.13 5.13c.3.3.3.79 0 1.09-.15.15-.35.23-.55.23z"/>
                    <path d="M20.68 12.78H2.32c-.43 0-.78-.35-.78-.78s.35-.78.78-.78h18.36c.43 0 .78.35.78.78s-.35.78-.78.78z"/>
                </svg>
            ),
            color: 'yellow'
        },
        {
            key: 'BANK_TRANSFER' as PaymentMethod,
            title: 'Transferencia',
            description: 'Transferencia bancaria',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: 'purple'
        },
        {
            key: 'CASH' as PaymentMethod,
            title: 'Efectivo',
            description: 'Pago en el lugar',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'gray'
        }
    ];

    const getColorClasses = (color: string, isSelected: boolean) => {
        const colors = {
            blue: {
                border: isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-200 hover:border-blue-300',
                bg: isSelected ? 'bg-blue-50' : 'bg-white hover:bg-blue-50',
                icon: isSelected ? 'text-blue-600' : 'text-blue-500',
                title: isSelected ? 'text-blue-900' : 'text-gray-900',
                description: isSelected ? 'text-blue-700' : 'text-gray-600'
            },
            green: {
                border: isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-green-200 hover:border-green-300',
                bg: isSelected ? 'bg-green-50' : 'bg-white hover:bg-green-50',
                icon: isSelected ? 'text-green-600' : 'text-green-500',
                title: isSelected ? 'text-green-900' : 'text-gray-900',
                description: isSelected ? 'text-green-700' : 'text-gray-600'
            },
            yellow: {
                border: isSelected ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-yellow-200 hover:border-yellow-300',
                bg: isSelected ? 'bg-yellow-50' : 'bg-white hover:bg-yellow-50',
                icon: isSelected ? 'text-yellow-600' : 'text-yellow-500',
                title: isSelected ? 'text-yellow-900' : 'text-gray-900',
                description: isSelected ? 'text-yellow-700' : 'text-gray-600'
            },
            purple: {
                border: isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200 hover:border-purple-300',
                bg: isSelected ? 'bg-purple-50' : 'bg-white hover:bg-purple-50',
                icon: isSelected ? 'text-purple-600' : 'text-purple-500',
                title: isSelected ? 'text-purple-900' : 'text-gray-900',
                description: isSelected ? 'text-purple-700' : 'text-gray-600'
            },
            gray: {
                border: isSelected ? 'border-gray-500 ring-2 ring-gray-200' : 'border-gray-200 hover:border-gray-300',
                bg: isSelected ? 'bg-gray-50' : 'bg-white hover:bg-gray-50',
                icon: isSelected ? 'text-gray-600' : 'text-gray-500',
                title: isSelected ? 'text-gray-900' : 'text-gray-900',
                description: isSelected ? 'text-gray-700' : 'text-gray-600'
            }
        };
        return colors[color as keyof typeof colors] || colors.gray;
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecciona tu método de pago
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.key;
                    const colors = getColorClasses(method.color, isSelected);
                    
                    return (
                        <button
                            key={method.key}
                            type="button"
                            onClick={() => onMethodSelect(method.key)}
                            disabled={disabled}
                            className={`
                                relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                                ${colors.border} ${colors.bg}
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            `}
                        >
                            {/* Popular Badge */}
                            {method.popular && (
                                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                    Popular
                                </div>
                            )}
                            
                            {/* Method Content */}
                            <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 ${colors.icon}`}>
                                    {method.icon}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-medium ${colors.title}`}>
                                        {method.title}
                                    </h3>
                                    <p className={`text-xs mt-1 ${colors.description}`}>
                                        {method.description}
                                    </p>
                                </div>
                                
                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethodCards;
