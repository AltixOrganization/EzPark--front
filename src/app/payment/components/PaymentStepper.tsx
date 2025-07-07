// src/app/payment/components/PaymentStepper.tsx

import React from 'react';

export type PaymentStep = 'information' | 'method' | 'confirmation' | 'processing';

interface PaymentStepperProps {
    currentStep: PaymentStep;
    completedSteps: PaymentStep[];
}

const PaymentStepper: React.FC<PaymentStepperProps> = ({ currentStep, completedSteps }) => {
    const steps = [
        {
            key: 'information' as PaymentStep,
            title: 'Información',
            description: 'Datos del pago',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            key: 'method' as PaymentStep,
            title: 'Método de Pago',
            description: 'Selecciona tu método',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            key: 'confirmation' as PaymentStep,
            title: 'Confirmación',
            description: 'Revisa tu pago',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            key: 'processing' as PaymentStep,
            title: 'Procesando',
            description: 'Confirmando pago',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            )
        }
    ];

    const getStepStatus = (stepKey: PaymentStep) => {
        if (completedSteps.includes(stepKey)) return 'completed';
        if (stepKey === currentStep) return 'current';
        return 'pending';
    };

    const getStepClasses = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    circle: 'bg-green-600 text-white border-green-600',
                    title: 'text-green-600',
                    description: 'text-green-500',
                    connector: 'bg-green-600'
                };
            case 'current':
                return {
                    circle: 'bg-blue-600 text-white border-blue-600 animate-pulse',
                    title: 'text-blue-600',
                    description: 'text-blue-500',
                    connector: 'bg-gray-300'
                };
            default:
                return {
                    circle: 'bg-gray-100 text-gray-400 border-gray-300',
                    title: 'text-gray-400',
                    description: 'text-gray-300',
                    connector: 'bg-gray-300'
                };
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.key);
                    const classes = getStepClasses(status);
                    const isLastStep = index === steps.length - 1;

                    return (
                        <div key={step.key} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="relative">
                                <div className={`
                                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                                    ${classes.circle}
                                `}>
                                    {status === 'completed' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.icon
                                    )}
                                </div>
                                
                                {/* Step Info */}
                                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                                    <p className={`text-sm font-medium transition-colors duration-300 ${classes.title}`}>
                                        {step.title}
                                    </p>
                                    <p className={`text-xs transition-colors duration-300 ${classes.description}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {!isLastStep && (
                                <div className={`
                                    flex-1 h-0.5 mx-4 transition-all duration-300
                                    ${status === 'completed' ? classes.connector : 'bg-gray-300'}
                                `} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentStepper;
