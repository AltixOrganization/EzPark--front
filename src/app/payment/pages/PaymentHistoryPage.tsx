// src/app/payment/pages/PaymentHistoryPage.tsx

import React, { useEffect, useState } from 'react';
import { usePayment } from '../hooks/usePayment';
import PaymentCard from '../components/PaymentCard';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Payment } from '../types/payment.types';

const PaymentHistoryPage: React.FC = () => {
    const { 
        payments, 
        loading, 
        error, 
        loadMyPayments, 
        processRefund 
    } = usePayment();
    
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    useEffect(() => {
        loadMyPayments();
    }, [loadMyPayments]);

    const filteredPayments = payments;

    const getTotalAmount = () => {
        return payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, payment) => sum + payment.amount, 0);
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    const handleViewDetails = (payment: Payment) => {
        setSelectedPayment(payment);
    };

    const handleRefund = async (paymentId: number) => {
        if (confirm('¿Estás seguro de que quieres procesar este reembolso?')) {
            try {
                await processRefund(paymentId);
                alert('Reembolso procesado exitosamente');
            } catch (err) {
                console.error('Error processing refund:', err);
                alert('Error al procesar reembolso');
            }
        }
    };

    if (loading && payments.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Historial de Pagos</h1>
                <p className="text-gray-600 mt-2">
                    Todos tus pagos por estacionamientos
                </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Pagos</p>
                            <p className="text-2xl font-semibold text-gray-900">{payments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Gastado</p>
                            <p className="text-2xl font-semibold text-gray-900">{formatAmount(getTotalAmount())}</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Payments List */}
            {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes pagos aún
                    </h3>
                    <p className="text-gray-500">
                        Los pagos que realices aparecerán aquí
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {filteredPayments.map(payment => (
                        <PaymentCard
                            key={payment.id}
                            payment={payment}
                            showActions={true}
                            onViewDetails={handleViewDetails}
                            onRefund={handleRefund}
                            isAdmin={false}
                        />
                    ))}
                </div>
            )}

            {/* Modal de detalles de pago */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Detalles del Pago
                            </h3>
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <PaymentCard
                            payment={selectedPayment}
                            showActions={false}
                            isAdmin={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistoryPage;
