// src/app/reservation/components/ExpandableReservationCard.tsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Reservation } from '../types/reservation.types';
import { ParkingService } from '../../parking/services/parkingService';

interface ExpandableReservationCardProps {
    reservation: Reservation;
    onUpdateStatus?: (id: number, status: string) => void;
    showActions?: boolean;
    isHost?: boolean;
}

const ExpandableReservationCard: React.FC<ExpandableReservationCardProps> = ({
    reservation,
    onUpdateStatus,
    showActions = false,
    isHost = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [parkingAddress, setParkingAddress] = useState<string>('');
    const [loadingAddress, setLoadingAddress] = useState(false);

    // Cargar la dirección del parking
    useEffect(() => {
        const loadParkingAddress = async () => {
            if (reservation.parkingId && !reservation.parking?.location?.address) {
                try {
                    setLoadingAddress(true);
                    const parkingDetails = await ParkingService.getParkingById(reservation.parkingId);
                    setParkingAddress(parkingDetails.location?.address || 'Dirección no disponible');
                } catch (error) {
                    console.error('Error al cargar dirección del parking:', error);
                    setParkingAddress('Dirección no disponible');
                } finally {
                    setLoadingAddress(false);
                }
            }
        };

        loadParkingAddress();
    }, [reservation.parkingId, reservation.parking?.location?.address]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'InProgress':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
            case 'Approved':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'InProgress':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6l.707.707a1 1 0 001.414-1.414L11 9.586V5z" clipRule="evenodd" />
                    </svg>
                );
            case 'Completed':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'Cancelled':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
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

    const displayAddress = () => {
        if (reservation.parking?.location?.address) {
            return reservation.parking.location.address;
        }
        if (parkingAddress) {
            return parkingAddress;
        }
        if (loadingAddress) {
            return 'Cargando dirección...';
        }
        return 'Dirección no disponible';
    };

    const handleCardClick = () => {
        setIsExpanded(!isExpanded);
    };

    const getPriorityLevel = () => {
        const now = new Date();
        const reservationDate = new Date(reservation.reservationDate);
        const diffHours = (reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (diffHours < 24 && reservation.status === 'Pending') return 'urgent';
        if (diffHours < 72 && reservation.status === 'Pending') return 'high';
        return 'normal';
    };

    const priorityLevel = getPriorityLevel();

    return (
        <div 
            className={`bg-white border-l-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 hover:border-gray-300 ${
                priorityLevel === 'urgent' ? 'border-l-red-500' :
                priorityLevel === 'high' ? 'border-l-orange-500' :
                'border-l-gray-300'
            }`}
            onClick={handleCardClick}
        >
            {/* Header - Always visible */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Status indicator */}
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusIcon(reservation.status)}
                            <span>{getStatusText(reservation.status)}</span>
                        </div>

                        {/* Priority indicator */}
                        {priorityLevel !== 'normal' && (
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                priorityLevel === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                                {priorityLevel === 'urgent' ? '🔴 Urgente' : '🟠 Alta'}
                            </div>
                        )}

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900 truncate">
                                    {reservation.guest?.firstName} {reservation.guest?.lastName}
                                </h3>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-600">{formatDate(reservation.reservationDate)}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-600">
                                    {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 truncate">
                                📍 {displayAddress()}
                            </p>
                        </div>
                    </div>

                    {/* Amount and expand icon */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                                S/ {reservation.totalFare.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {reservation.hoursRegistered}h
                            </p>
                        </div>
                        <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-4 space-y-4">
                        {/* Customer details */}
                        {isHost && reservation.guest && (
                            <div className="bg-white p-3 rounded-lg border">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Cliente</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Nombre:</span>
                                        <p className="font-medium">{reservation.guest.firstName} {reservation.guest.lastName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Email:</span>
                                        <p className="font-medium">{reservation.guest.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Vehicle details */}
                        {reservation.vehicle && (
                            <div className="bg-white p-3 rounded-lg border">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Vehículo</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Vehículo:</span>
                                        <p className="font-medium">
                                            {reservation.vehicle.model?.brand?.name} {reservation.vehicle.model?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Placa:</span>
                                        <p className="font-medium">{reservation.vehicle.licensePlate}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Parking details */}
                        <div className="bg-white p-3 rounded-lg border">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Detalles del Estacionamiento</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Espacio:</span>
                                    <span className="font-medium">{reservation.parking?.space || `#${reservation.parkingId}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Dirección:</span>
                                    <span className="font-medium text-right">{displayAddress()}</span>
                                </div>
                                {reservation.parking?.location?.district && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Distrito:</span>
                                        <span className="font-medium">{reservation.parking.location.district}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Precio por hora:</span>
                                    <span className="font-medium">S/ {(reservation.totalFare / reservation.hoursRegistered).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {showActions && onUpdateStatus && (
                            <div className="bg-white p-3 rounded-lg border">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Acciones</h4>
                                
                                {reservation.status === 'Pending' && isHost && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateStatus(reservation.id, 'Approved');
                                            }}
                                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            ✅ Aprobar
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateStatus(reservation.id, 'Cancelled');
                                            }}
                                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                                        >
                                            ❌ Rechazar
                                        </button>
                                    </div>
                                )}

                                {reservation.status === 'Approved' && isHost && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateStatus(reservation.id, 'InProgress');
                                        }}
                                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        🚀 Iniciar
                                    </button>
                                )}

                                {reservation.status === 'InProgress' && isHost && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateStatus(reservation.id, 'Completed');
                                        }}
                                        className="w-full bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        🏁 Completar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpandableReservationCard;
