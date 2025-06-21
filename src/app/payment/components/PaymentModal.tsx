// src/app/payment/components/PaymentModal.tsx

import React from 'react';
import PaymentForm from './PaymentForm';
import type { PaymentFormData } from '../types/payment.types';
import type { Reservation } from '../../reservation/types/reservation.types';

interface PaymentModalProps {
    isOpen: boolean;
    reservation: Reservation | null;
    onClose: () => void;
    onSubmit: (data: PaymentFormData) => void;
    loading?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
    isOpen, 
    reservation, 
    onClose, 
    onSubmit, 
    loading = false 
}) => {
    if (!isOpen || !reservation) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Procesar Pago
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Reserva #{reservation.id} - {reservation.parking?.space || 'Espacio de estacionamiento'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <PaymentForm
                    onSubmit={onSubmit}
                    loading={loading}
                    reservationAmount={reservation.totalFare}
                />
            </div>
        </div>
    );
};

export default PaymentModal;
