// src/app/payment/components/PaymentStatusAnimation.tsx

import React, { useEffect, useState, useCallback } from 'react';

interface PaymentStatusAnimationProps {
    status: 'success' | 'error' | 'processing' | null;
    message: string;
    onClose?: () => void;
    autoCloseDelay?: number;
}

const PaymentStatusAnimation: React.FC<PaymentStatusAnimationProps> = ({
    status,
    message,
    onClose,
    autoCloseDelay = 5000
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (status) {
            setIsVisible(true);
            setIsAnimating(true);
            
            if (status !== 'processing' && autoCloseDelay > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, autoCloseDelay);
                
                return () => clearTimeout(timer);
            }
        }
    }, [status, autoCloseDelay, handleClose]);

    if (!isVisible || !status) {
        return null;
    }

    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    icon: (
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 animate-bounce">
                            <svg className="h-8 w-8 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ),
                    title: '¡Pago Exitoso!',
                    titleColor: 'text-green-900',
                    messageColor: 'text-green-700',
                    buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: (
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 animate-pulse">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    ),
                    title: 'Error en el Pago',
                    titleColor: 'text-red-900',
                    messageColor: 'text-red-700',
                    buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                };
            case 'processing':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: (
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                            <svg className="h-8 w-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ),
                    title: 'Procesando Pago...',
                    titleColor: 'text-blue-900',
                    messageColor: 'text-blue-700',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    icon: null,
                    title: '',
                    titleColor: 'text-gray-900',
                    messageColor: 'text-gray-700',
                    buttonColor: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <>
            {/* Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`} />
            
            {/* Modal */}
            <div className={`fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 transition-all duration-300 ${
                isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
                <div className={`
                    relative w-full max-w-md mx-auto rounded-lg shadow-xl border-2 p-6
                    ${config.bg} ${config.border}
                    transform transition-all duration-300
                    ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                `}>
                    {/* Close Button (only for non-processing states) */}
                    {status !== 'processing' && (
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {/* Icon */}
                    <div className="mb-6">
                        {config.icon}
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h3 className={`text-xl font-bold mb-3 ${config.titleColor}`}>
                            {config.title}
                        </h3>
                        <p className={`text-sm mb-6 ${config.messageColor}`}>
                            {message}
                        </p>

                        {/* Action Button (only for non-processing states) */}
                        {status !== 'processing' && (
                            <button
                                onClick={handleClose}
                                className={`
                                    w-full px-4 py-2 text-white font-medium rounded-md transition-colors
                                    focus:outline-none focus:ring-2 focus:ring-offset-2
                                    ${config.buttonColor}
                                `}
                            >
                                {status === 'success' ? 'Continuar' : 'Intentar de nuevo'}
                            </button>
                        )}

                        {/* Processing indicator */}
                        {status === 'processing' && (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-sm text-blue-700">Por favor espera...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentStatusAnimation;
