// src/app/payment/components/PaymentForm.tsx

import React, { useState } from 'react';
import type { PaymentFormData } from '../types/payment.types';
import PaymentService from '../services/paymentService';

interface PaymentFormProps {
    onSubmit: (data: PaymentFormData) => void;
    loading?: boolean;
    reservationAmount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
    onSubmit, 
    loading = false, 
    reservationAmount 
}) => {
    const [formData, setFormData] = useState<PaymentFormData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        email: '',
    });

    const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<PaymentFormData> = {};

        // Validar número de tarjeta
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'El número de tarjeta es requerido';
        } else if (!PaymentService.validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = 'Número de tarjeta inválido';
        }

        // Validar fecha de expiración
        if (!formData.expiryDate.trim()) {
            newErrors.expiryDate = 'La fecha de expiración es requerida';
        } else if (!PaymentService.validateExpiryDate(formData.expiryDate)) {
            newErrors.expiryDate = 'Fecha de expiración inválida (MM/YY)';
        }

        // Validar CVV
        if (!formData.cvv.trim()) {
            newErrors.cvv = 'El CVV es requerido';
        } else if (!PaymentService.validateCVV(formData.cvv)) {
            newErrors.cvv = 'CVV inválido (3-4 dígitos)';
        }

        // Validar nombre del titular
        if (!formData.cardHolderName.trim()) {
            newErrors.cardHolderName = 'El nombre del titular es requerido';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof PaymentFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const cardBrand = formData.cardNumber ? PaymentService.getCardBrand(formData.cardNumber) : '';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resumen del monto */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total a pagar:</span>
                    <span className="text-2xl font-bold text-blue-600">
                        S/ {reservationAmount.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Número de tarjeta */}
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de tarjeta
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                    />
                    {cardBrand && cardBrand !== 'Unknown' && (
                        <div className="absolute right-3 top-3 text-sm text-gray-500">
                            {cardBrand}
                        </div>
                    )}
                </div>
                {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
            </div>

            {/* Fecha de expiración y CVV */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de expiración
                    </label>
                    <input
                        type="text"
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                    />
                    {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                    </label>
                    <input
                        type="text"
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                    />
                    {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                    )}
                </div>
            </div>

            {/* Nombre del titular */}
            <div>
                <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del titular
                </label>
                <input
                    type="text"
                    id="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    placeholder="Nombre completo como aparece en la tarjeta"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                />
                {errors.cardHolderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardHolderName}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            {/* Botón de envío */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Procesando pago...
                    </div>
                ) : (
                    `Pagar S/ ${reservationAmount.toFixed(2)}`
                )}
            </button>

            {/* Información de seguridad */}
            <div className="text-xs text-gray-500 text-center">
                <p>🔒 Tu información está protegida con encriptación SSL</p>
                <p>No almacenamos los datos de tu tarjeta</p>
            </div>
        </form>
    );
};

export default PaymentForm;
