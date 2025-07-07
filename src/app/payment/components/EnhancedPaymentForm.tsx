// src/app/payment/components/EnhancedPaymentForm.tsx

import React, { useState } from 'react';
import PaymentStepper, { type PaymentStep } from './PaymentStepper';
import PaymentMethodCards from './PaymentMethodCards';
import PaymentStatusAnimation from './PaymentStatusAnimation';
import SecurityBadges from './SecurityBadges';
import type { PaymentFormData, Payment } from '../types/payment.types';
import PaymentService from '../services/paymentService';

interface EnhancedPaymentFormProps {
    onSubmit: (data: PaymentFormData) => void;
    loading?: boolean;
    reservationAmount: number;
    onPaymentSuccess?: (payment: Payment) => void;
    onPaymentError?: (error: string) => void;
}

const EnhancedPaymentForm: React.FC<EnhancedPaymentFormProps> = ({ 
    onSubmit, 
    loading = false, 
    reservationAmount,
    onPaymentSuccess,
    onPaymentError 
}) => {
    // Stepper state
    const [currentStep, setCurrentStep] = useState<PaymentStep>('information');
    const [completedSteps, setCompletedSteps] = useState<PaymentStep[]>([]);

    // Form data
    const [formData, setFormData] = useState<PaymentFormData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        email: '',
    });
    
    const [selectedMethod, setSelectedMethod] = useState<Payment['paymentMethod'] | null>(null);
    const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

    // Payment status
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'processing' | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Validation functions
    const validateInformation = (): boolean => {
        const newErrors: Partial<PaymentFormData> = {};

        if (!formData.cardHolderName.trim()) {
            newErrors.cardHolderName = 'El nombre del titular es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePaymentMethod = (): boolean => {
        if (!selectedMethod) {
            alert('Por favor selecciona un método de pago');
            return false;
        }

        if (selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') {
            const newErrors: Partial<PaymentFormData> = {};

            if (!formData.cardNumber.trim()) {
                newErrors.cardNumber = 'El número de tarjeta es requerido';
            } else if (!PaymentService.validateCardNumber(formData.cardNumber)) {
                newErrors.cardNumber = 'Número de tarjeta inválido';
            }

            if (!formData.expiryDate.trim()) {
                newErrors.expiryDate = 'La fecha de expiración es requerida';
            } else if (!PaymentService.validateExpiryDate(formData.expiryDate)) {
                newErrors.expiryDate = 'Fecha de expiración inválida (MM/YY)';
            }

            if (!formData.cvv.trim()) {
                newErrors.cvv = 'El CVV es requerido';
            } else if (!PaymentService.validateCVV(formData.cvv)) {
                newErrors.cvv = 'CVV inválido (3-4 dígitos)';
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }

        return true;
    };

    // Step navigation
    const handleNext = () => {
        switch (currentStep) {
            case 'information':
                if (validateInformation()) {
                    setCompletedSteps([...completedSteps, 'information']);
                    setCurrentStep('method');
                }
                break;
            case 'method':
                if (validatePaymentMethod()) {
                    setCompletedSteps([...completedSteps, 'method']);
                    setCurrentStep('confirmation');
                }
                break;
            case 'confirmation':
                handleProcessPayment();
                break;
        }
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'method':
                setCurrentStep('information');
                break;
            case 'confirmation':
                setCurrentStep('method');
                break;
        }
    };

    const handleProcessPayment = async () => {
        setCurrentStep('processing');
        setCompletedSteps([...completedSteps, 'confirmation']);
        setPaymentStatus('processing');
        setStatusMessage('Procesando tu pago de forma segura...');

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Call the original onSubmit
            onSubmit(formData);
            
            setPaymentStatus('success');
            setStatusMessage('¡Tu pago ha sido procesado exitosamente! En breve recibirás un email de confirmación.');
            setCompletedSteps([...completedSteps, 'processing']);
            
        } catch (error) {
            setPaymentStatus('error');
            setStatusMessage('Hubo un error al procesar tu pago. Por favor, verifica tus datos e inténtalo nuevamente.');
            onPaymentError?.(error instanceof Error ? error.message : 'Error desconocido');
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    const resetForm = () => {
        setCurrentStep('information');
        setCompletedSteps([]);
        setPaymentStatus(null);
        setStatusMessage('');
        setErrors({});
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Completar Pago
                </h2>
                <div className="text-3xl font-bold text-blue-600">
                    {formatAmount(reservationAmount)}
                </div>
            </div>

            {/* Stepper */}
            <PaymentStepper currentStep={currentStep} completedSteps={completedSteps} />

            {/* Form Content */}
            <div className="mt-8">
                {currentStep === 'information' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Información del Pago</h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del titular
                                </label>
                                <input
                                    type="text"
                                    value={formData.cardHolderName}
                                    onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Juan Pérez"
                                />
                                {errors.cardHolderName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="juan@ejemplo.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 'method' && (
                    <div className="space-y-6">
                        <PaymentMethodCards
                            selectedMethod={selectedMethod}
                            onMethodSelect={setSelectedMethod}
                            disabled={loading}
                        />

                        {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900">Datos de la tarjeta</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de tarjeta
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                        {errors.cardNumber && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de expiración
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                        />
                                        {errors.expiryDate && (
                                            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cvv}
                                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.cvv ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="123"
                                            maxLength={4}
                                        />
                                        {errors.cvv && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <SecurityBadges size="sm" />
                    </div>
                )}

                {currentStep === 'confirmation' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Confirmar Pago</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monto:</span>
                                <span className="font-semibold">{formatAmount(reservationAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Método de pago:</span>
                                <span className="font-semibold">
                                    {selectedMethod === 'CREDIT_CARD' ? 'Tarjeta de Crédito' :
                                     selectedMethod === 'DEBIT_CARD' ? 'Tarjeta de Débito' :
                                     selectedMethod === 'PAYPAL' ? 'PayPal' :
                                     selectedMethod === 'CASH' ? 'Efectivo' :
                                     selectedMethod === 'BANK_TRANSFER' ? 'Transferencia' : selectedMethod}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-semibold">{formData.email}</span>
                            </div>
                            {formData.cardNumber && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tarjeta:</span>
                                    <span className="font-semibold">•••• {formData.cardNumber.slice(-4)}</span>
                                </div>
                            )}
                        </div>

                        <SecurityBadges />
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            {currentStep !== 'processing' && (
                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 'information' || loading}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${
                            currentStep === 'information' || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Anterior
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={loading}
                        className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {currentStep === 'confirmation' ? 'Pagar Ahora' : 'Siguiente'}
                    </button>
                </div>
            )}

            {/* Payment Status Animation */}
            <PaymentStatusAnimation
                status={paymentStatus}
                message={statusMessage}
                onClose={() => {
                    if (paymentStatus === 'success') {
                        // In a real implementation, this would be the actual payment object
                        onPaymentSuccess?.(undefined as unknown as Payment);
                    } else if (paymentStatus === 'error') {
                        resetForm();
                    }
                    setPaymentStatus(null);
                }}
            />
        </div>
    );
};

export default EnhancedPaymentForm;
