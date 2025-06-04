// src/app/parking/components/ParkingCard.tsx

import React, { useState, useRef, useEffect } from 'react';
import type { Parking } from '../types/parking.types';

interface ParkingCardProps {
    parking: Parking;
    onDelete?: () => void;
    onEdit?: () => void;
    onView?: () => void;
    onReserve?: () => void;
    isOwner?: boolean;
    deleting?: boolean;
}

const ParkingCard: React.FC<ParkingCardProps> = ({
    parking,
    onDelete,
    onEdit,
    onView,
    onReserve,
    isOwner = false,
    deleting = false
}) => {
    const [showActions, setShowActions] = useState(false);
    const [imageError, setImageError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Generar imagen placeholder o usar una imagen por defecto
    const placeholderImage = `https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Estacionamiento`;

    // Cerrar dropdown cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = () => {
        const availableSpaces = parking.space;
        if (availableSpaces === 0) return 'bg-red-100 text-red-800';
        if (availableSpaces <= 2) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = () => {
        const availableSpaces = parking.space;
        if (availableSpaces === 0) return 'Completo';
        if (availableSpaces === 1) return '1 espacio';
        return `${availableSpaces} espacios`;
    };

    const handleActionClick = (action: () => void) => {
        action();
        setShowActions(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
                {!imageError ? (
                    <img
                        src={placeholderImage}
                        alt={`Estacionamiento en ${parking.location.district}`}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-sm">Estacionamiento</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                </div>

                {/* Actions Button (para propietarios) */}
                {isOwner && (
                    <div className="absolute top-3 right-3" ref={dropdownRef}>
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={deleting}
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        {/* Dropdown de acciones */}
                        {showActions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                <div className="py-1">
                                    {onView && (
                                        <button
                                            onClick={() => handleActionClick(onView)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Ver detalles
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            onClick={() => handleActionClick(onEdit)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => handleActionClick(onDelete)}
                                            disabled={deleting}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            {deleting ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full">
                        <span className="text-sm font-bold">S/ {parking.price.toFixed(2)}</span>
                        <span className="text-xs">/hora</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Location */}
                <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {parking.location.district}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{parking.location.address}</span>
                    </p>
                </div>

                {/* Specifications */}
                <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="text-center">
                            <p className="font-medium text-gray-900">{parking.width}m</p>
                            <p>Ancho</p>
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-gray-900">{parking.length}m</p>
                            <p>Largo</p>
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-gray-900">{parking.height}m</p>
                            <p>Alto</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {parking.description}
                </p>

                {/* Contact Info */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="truncate">{parking.phone}</span>
                </div>

                {/* Metadata */}
                {parking.createdAt && (
                    <div className="text-xs text-gray-400 mb-4">
                        Publicado el {formatDate(parking.createdAt)}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    {!isOwner && onReserve && (
                        <button
                            onClick={onReserve}
                            disabled={parking.space === 0}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            {parking.space === 0 ? 'No disponible' : 'Reservar'}
                        </button>
                    )}
                    
                    {!isOwner && onView && (
                        <button
                            onClick={onView}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200 text-sm font-medium"
                        >
                            Ver detalles
                        </button>
                    )}

                    {isOwner && (
                        <div className="flex space-x-2 w-full">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition duration-200 text-sm font-medium"
                                >
                                    Editar
                                </button>
                            )}
                            {onView && (
                                <button
                                    onClick={onView}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200 text-sm font-medium"
                                >
                                    Ver
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParkingCard;
