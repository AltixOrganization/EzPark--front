// src/app/public/pages/home/components/ParkingInfoWindow.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../../../../shared/providers/GoogleMapsProvider';
import StarRating from '../../../../review/components/StarRating';
import MapsCredential from '../../../../credentials/MapsCredential';
import type { Parking } from '../../../../parking/types/parking.types';

interface ParkingInfoWindowProps {
    parking: Parking;
    onClose: () => void;
    onViewDetails: (parking: Parking) => void;
    onReserve: (parking: Parking) => void;
    averageRating?: number;
    totalReviews?: number;
}

// Funciones auxiliares para generar URLs de imágenes
const getStreetViewImageUrl = (latitude: number, longitude: number) => {
    const size = '300x150';
    const fov = '80';
    const heading = '0';
    const pitch = '0';
    
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${latitude},${longitude}&heading=${heading}&pitch=${pitch}&fov=${fov}&key=${MapsCredential.mapsKey}`;
};

const getStaticMapImageUrl = (latitude: number, longitude: number) => {
    const zoom = '16';
    const size = '300x150';
    const maptype = 'roadmap';
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=color:red%7C${latitude},${longitude}&key=${MapsCredential.mapsKey}`;
};

const getPlaceholderImage = (district: string) => {
    return `https://via.placeholder.com/300x150/3B82F6/FFFFFF?text=Estacionamiento+${encodeURIComponent(district)}`;
};

const ParkingInfoWindow: React.FC<ParkingInfoWindowProps> = ({
    parking,
    onClose,
    onViewDetails,
    onReserve,
    averageRating = 0,
    totalReviews = 0
}) => {
    const { isLoaded } = useGoogleMaps();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const loadStreetViewImage = useCallback(async () => {
        try {
            const streetViewService = new google.maps.StreetViewService();
            const { latitude, longitude } = parking.location;

            // Verificar disponibilidad de Street View
            streetViewService.getPanorama({
                location: { lat: latitude, lng: longitude },
                radius: 100,
            }, (_, status) => {
                if (status === google.maps.StreetViewStatus.OK) {
                    // Street View disponible - usar imagen estática
                    const streetViewUrl = getStreetViewImageUrl(latitude, longitude);
                    setImageUrl(streetViewUrl);
                } else {
                    // No hay Street View - usar mapa estático
                    const mapUrl = getStaticMapImageUrl(latitude, longitude);
                    setImageUrl(mapUrl);
                }
                setImageLoaded(true);
            });
        } catch (error) {
            console.error('Error al cargar Street View:', error);
            // Fallback a mapa estático
            const { latitude, longitude } = parking.location;
            const mapUrl = getStaticMapImageUrl(latitude, longitude);
            setImageUrl(mapUrl);
            setImageLoaded(true);
        }
    }, [parking.location]);

    // Cargar imagen de Street View cuando Google Maps esté listo
    useEffect(() => {
        if (isLoaded && !imageLoaded && !imageError) {
            loadStreetViewImage();
        }
    }, [isLoaded, imageLoaded, imageError, loadStreetViewImage]);

    const handleImageError = () => {
        setImageError(true);
        setImageUrl(getPlaceholderImage(parking.location.district));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(price);
    };

    const getAvailabilityStatus = () => {
        // Por ahora simulamos disponibilidad basado en los espacios del parking
        // En una implementación real, esto vendría del backend
        const availableSpaces = Math.floor(Math.random() * parking.space);
        return {
            available: availableSpaces,
            total: parking.space,
            isAvailable: availableSpaces > 0
        };
    };

    const availability = getAvailabilityStatus();

    return (
        <InfoWindow
            position={{
                lat: parking.location.latitude,
                lng: parking.location.longitude
            }}
            onCloseClick={onClose}
            options={{
                maxWidth: 300,
                pixelOffset: new google.maps.Size(0, -30)
            }}
        >
            <div className="p-4 max-w-sm">
                {/* Header con imagen */}
                <div className="mb-3">
                    {/* Imagen del estacionamiento - Street View o mapa estático */}
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                        {imageLoaded ? (
                            <img
                                src={imageUrl}
                                alt={`Vista de ${parking.location.district}`}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                            />
                        ) : (
                            // Loading placeholder
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                                <div className="text-center text-white">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-1"></div>
                                    <p className="text-xs">Cargando vista...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                        📍 {parking.location.address}
                    </p>
                </div>

                {/* Rating */}
                {totalReviews > 0 && (
                    <div className="flex items-center mb-3">
                        <StarRating rating={averageRating} size="sm" showValue={false} />
                        <span className="ml-2 text-sm text-gray-600">
                            {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                        </span>
                    </div>
                )}

                {/* Precio */}
                <div className="mb-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Precio por hora:</span>
                        <span className="font-semibold text-lg text-green-600">
                            {formatPrice(parking.price)}
                        </span>
                    </div>
                </div>

                {/* Disponibilidad */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Disponibilidad:</span>
                        <span className={`text-sm font-medium ${availability.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {availability.available}/{availability.total} espacios
                        </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                                availability.isAvailable ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                                width: `${(availability.available / availability.total) * 100}%` 
                            }}
                        />
                    </div>
                </div>

                {/* Características del estacionamiento */}
                <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                            <span className="text-gray-600">📐 Dimensiones:</span>
                        </div>
                        <div className="text-right text-gray-900">
                            {parking.width}×{parking.length}×{parking.height}m
                        </div>
                        
                        <div className="flex items-center">
                            <span className="text-gray-600">📞 Teléfono:</span>
                        </div>
                        <div className="text-right text-gray-900">
                            {parking.phone}
                        </div>
                    </div>
                    
                    {parking.description && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {parking.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="space-y-2">
                    <button
                        onClick={() => onReserve(parking)}
                        disabled={!availability.isAvailable}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            availability.isAvailable
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {availability.isAvailable ? '🅿️ Reservar Ahora' : '❌ No Disponible'}
                    </button>
                    
                    <button
                        onClick={() => onViewDetails(parking)}
                        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        👁️ Ver Detalles
                    </button>
                </div>
            </div>
        </InfoWindow>
    );
};

export default ParkingInfoWindow;
