// src/app/reservation/components/ReservationCard.tsx

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Reservation } from '../types/reservation.types';

interface ReservationCardProps {
    reservation: Reservation;
    onUpdateStatus?: (id: number, status: string) => void;
    onPayReservation?: (reservation: Reservation) => void;
    showActions?: boolean;
    isHost?: boolean;
    paymentStatus?: 'none' | 'pending' | 'completed' | 'failed';
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    onUpdateStatus,
    onPayReservation,
    showActions = false,
    isHost = false,
    paymentStatus = 'none'
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Approved':
                return 'bg-blue-100 text-blue-800';
            case 'InProgress':
                return 'bg-green-100 text-green-800';
            case 'Completed':
                return 'bg-gray-100 text-gray-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'Pendiente';
            case 'Approved':
                return 'Aprobada';
            case 'InProgress':
                return 'En Progreso';
            case 'Completed':
                return 'Completada';
            case 'Cancelled':
                return 'Cancelada';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString: string) => {
        try {
            return format(new Date(`2000-01-01T${timeString}`), 'HH:mm');
        } catch {
            return timeString;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {reservation.parking?.space || `Espacio #${reservation.parkingId}`}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                        📍 {reservation.parking?.location?.address || 'Dirección no disponible'}
                    </p>
                    {reservation.parking?.location?.district && (
                        <p className="text-sm text-gray-600">
                            {reservation.parking.location.district}, {reservation.parking.location.city}
                        </p>
                    )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {getStatusText(reservation.status)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{formatDate(reservation.reservationDate)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Horario</p>
                    <p className="font-medium">
                        {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Duración</p>
                    <p className="font-medium">{reservation.hoursRegistered}h</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Tarifa Total</p>
                    <p className="font-medium text-green-600">S/ {reservation.totalFare.toFixed(2)}</p>
                </div>
            </div>

            {reservation.vehicle && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Vehículo</p>
                    <p className="font-medium">
                        {reservation.vehicle.model?.brand?.name} {reservation.vehicle.model?.name}
                    </p>
                    <p className="text-sm text-gray-600">Placa: {reservation.vehicle.licensePlate}</p>
                </div>
            )}

            {isHost && reservation.guest && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Cliente</p>
                    <p className="font-medium">
                        {reservation.guest.firstName} {reservation.guest.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{reservation.guest.email}</p>
                </div>
            )}

            {!isHost && reservation.host && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Anfitrión</p>
                    <p className="font-medium">
                        {reservation.host.firstName} {reservation.host.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{reservation.host.email}</p>
                </div>
            )}

            {showActions && onUpdateStatus && reservation.status === 'Pending' && isHost && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => onUpdateStatus(reservation.id, 'Approved')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        Aprobar
                    </button>
                    <button
                        onClick={() => onUpdateStatus(reservation.id, 'Cancelled')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Rechazar
                    </button>
                </div>
            )}

            {showActions && onUpdateStatus && reservation.status === 'Approved' && isHost && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => onUpdateStatus(reservation.id, 'InProgress')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Iniciar
                    </button>
                </div>
            )}

            {showActions && onUpdateStatus && reservation.status === 'InProgress' && isHost && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => onUpdateStatus(reservation.id, 'Completed')}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                        Completar
                    </button>
                </div>
            )}

            {/* Acciones de pago para el guest */}
            {showActions && !isHost && reservation.status === 'Approved' && onPayReservation && (
                <div className="pt-4 border-t border-gray-200">
                    {paymentStatus === 'none' && (
                        <button
                            onClick={() => onPayReservation(reservation)}
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Pagar Reservación (S/ {reservation.totalFare.toFixed(2)})
                        </button>
                    )}
                    
                    {paymentStatus === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-yellow-800 font-medium">Pago en proceso...</p>
                            </div>
                        </div>
                    )}
                    
                    {paymentStatus === 'completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-800 font-medium">✅ Pago completado - Reservación confirmada</p>
                            </div>
                        </div>
                    )}
                    
                    {paymentStatus === 'failed' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-red-800 font-medium">❌ Error en el pago</p>
                                </div>
                                <button
                                    onClick={() => onPayReservation(reservation)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReservationCard;
