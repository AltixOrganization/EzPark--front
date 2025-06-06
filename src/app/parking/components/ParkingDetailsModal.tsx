// src/app/parking/components/ParkingDetailsModal.tsx

import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import MapsCredential from "../../credentials/MapsCredential";
import type { Parking } from '../types/parking.types';
import ScheduleManager from './schedule/ScheduleManager';

const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
};

interface ParkingDetailsModalProps {
    parking: Parking;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isOwner?: boolean;
}

const ParkingDetailsModal: React.FC<ParkingDetailsModalProps> = ({
    parking,
    onClose,
    onEdit,
    onDelete,
    isOwner = false
}) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MapsCredential.mapsKey,
        libraries: ["places"],
    });

    const mapCenter = {
        lat: parking.location.latitude,
        lng: parking.location.longitude,
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusInfo = () => {
        const availableSpaces = parking.space;
        if (availableSpaces === 0) {
            return { color: 'bg-red-100 text-red-800', text: 'Completo' };
        }
        if (availableSpaces <= 2) {
            return { color: 'bg-yellow-100 text-yellow-800', text: `${availableSpaces} espacio${availableSpaces > 1 ? 's' : ''} disponible${availableSpaces > 1 ? 's' : ''}` };
        }
        return { color: 'bg-green-100 text-green-800', text: `${availableSpaces} espacios disponibles` };
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Detalles del Estacionamiento
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {parking.location.district}, {parking.location.city}
                        </p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información principal */}
                        <div className="space-y-6">
                            {/* Status y precio */}
                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                    {statusInfo.text}
                                </span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-blue-600">S/ {parking.price.toFixed(2)}</span>
                                    <span className="text-gray-500 text-sm ml-1">/hora</span>
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Ubicación
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-gray-500">Dirección:</span>
                                            <p className="font-medium">{parking.location.address}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Número:</span>
                                            <p className="font-medium">{parking.location.numDirection}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-gray-500">Distrito:</span>
                                            <p className="font-medium">{parking.location.district}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Ciudad:</span>
                                            <p className="font-medium">{parking.location.city}</p>
                                        </div>
                                    </div>
                                    {parking.location.street && (
                                        <div>
                                            <span className="text-gray-500">Calle:</span>
                                            <p className="font-medium">{parking.location.street}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Especificaciones */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Especificaciones
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-500">Dimensiones:</span>
                                            <p className="font-medium">{parking.width} × {parking.length} × {parking.height} metros</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Espacios totales:</span>
                                            <p className="font-medium">{parking.space}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-500">Área total:</span>
                                            <p className="font-medium">{(parking.width * parking.length).toFixed(1)} m²</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Volumen:</span>
                                            <p className="font-medium">{(parking.width * parking.length * parking.height).toFixed(1)} m³</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descripción
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {parking.description}
                                </p>
                            </div>

                            {/* Contacto */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Información de contacto
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-500 text-sm">Teléfono:</span>
                                    <a
                                        href={`tel:${parking.phone}`}
                                        className="font-medium text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {parking.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Metadata */}
                            {parking.createdAt && (
                                <div className="text-xs text-gray-500 border-t pt-4">
                                    <div className="grid grid-cols-1 gap-2">
                                        <div>
                                            <span>Publicado:</span> {formatDate(parking.createdAt)}
                                        </div>
                                        {parking.updatedAt && parking.updatedAt !== parking.createdAt && (
                                            <div>
                                                <span>Última actualización:</span> {formatDate(parking.updatedAt)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mapa */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Ubicación en el mapa
                                </h3>
                                {isLoaded ? (
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={mapCenter}
                                            zoom={16}
                                            options={{
                                                disableDefaultUI: false,
                                                zoomControl: true,
                                                streetViewControl: false,
                                                mapTypeControl: false,
                                                fullscreenControl: true,
                                            }}
                                        >
                                            <Marker position={mapCenter} />
                                        </GoogleMap>
                                    </div>
                                ) : (
                                    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Cargando mapa...</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Coordenadas */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Coordenadas</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <div>Latitud: {parking.location.latitude.toFixed(6)}</div>
                                    <div>Longitud: {parking.location.longitude.toFixed(6)}</div>
                                </div>
                            </div>
                            {/* Schedule Manager (si es propietario) */}
                            {isOwner && (
                                <div className="mt-6">
                                    <ScheduleManager
                                        parkingId={parking.id!}
                                        parkingName={parking.location.district}
                                    />
                                </div>
                            )}

                            {/* Horarios (si los hay) */}
                            {parking.schedules && parking.schedules.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Horarios disponibles
                                    </h3>
                                    <div className="space-y-2">
                                        {parking.schedules.slice(0, 3).map((schedule, index) => (
                                            <div key={schedule.id || index} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {new Date(schedule.day).toLocaleDateString('es-ES')}
                                                </span>
                                                <span className="font-medium">
                                                    {schedule.startTime} - {schedule.endTime}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${schedule.isAvailable
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {schedule.isAvailable ? 'Disponible' : 'Ocupado'}
                                                </span>
                                            </div>
                                        ))}
                                        {parking.schedules.length > 3 && (
                                            <div className="text-xs text-gray-500 text-center pt-2">
                                                +{parking.schedules.length - 3} horarios más
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                            Cerrar
                        </button>

                        {isOwner && onEdit && (
                            <button
                                onClick={onEdit}
                                className="px-4 py-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Editar</span>
                            </button>
                        )}

                        {isOwner && onDelete && (
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Eliminar</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingDetailsModal;