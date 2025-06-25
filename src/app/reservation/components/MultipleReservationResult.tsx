// src/app/reservation/components/MultipleReservationResult.tsx

import React from 'react';
import type { Reservation } from '../types/reservation.types';

interface MultipleReservationResultProps {
    reservations: Reservation[];
    onClose: () => void;
    onViewReservations: () => void;
}

const MultipleReservationResult: React.FC<MultipleReservationResultProps> = ({
    reservations,
    onClose,
    onViewReservations
}) => {
    const totalAmount = reservations.reduce((sum, reservation) => sum + reservation.totalFare, 0);
    
    const formatTime = (timeString: string) => {
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                ¡Reservaciones Creadas Exitosamente!
                            </h2>
                            <p className="text-gray-600">
                                Se crearon {reservations.length} reservación{reservations.length !== 1 ? 'es' : ''} correctamente
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Summary */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Resumen de Reservaciones</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700">Total de reservaciones:</span>
                                <span className="font-medium text-blue-900 ml-2">{reservations.length}</span>
                            </div>
                            <div>
                                <span className="text-blue-700">Monto total:</span>
                                <span className="font-medium text-blue-900 ml-2">S/ {totalAmount.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-blue-700">Fecha:</span>
                                <span className="font-medium text-blue-900 ml-2">
                                    {new Date(reservations[0].reservationDate).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div>
                                <span className="text-blue-700">Estado:</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                                    Pendiente de aprobación
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reservations List */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 mb-3">Detalle de Horarios Reservados</h4>
                        <div className="space-y-2">
                            {reservations
                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                .map((reservation, index) => (
                                    <div 
                                        key={reservation.id} 
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {reservation.hoursRegistered} hora{reservation.hoursRegistered !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">
                                                S/ {reservation.totalFare.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: {reservation.id}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-2">📋 Próximos Pasos</h4>
                        <ul className="text-yellow-800 text-sm space-y-1">
                            <li>• El propietario del estacionamiento revisará tus reservaciones</li>
                            <li>• Recibirás una notificación cuando sean aprobadas</li>
                            <li>• Una vez aprobadas, podrás proceder con el pago</li>
                            <li>• Puedes ver el estado de tus reservaciones en "Mis Reservaciones"</li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={onViewReservations}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Ver Mis Reservaciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultipleReservationResult;
