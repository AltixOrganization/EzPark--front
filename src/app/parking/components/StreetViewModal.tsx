// src/app/parking/components/StreetViewModal.tsx

import React, { useEffect, useRef } from 'react';
import { useJsApiLoader } from "@react-google-maps/api";
import MapsCredential from "../../credentials/MapsCredential";
import type { Parking } from '../types/parking.types';

interface StreetViewModalProps {
    parking: Parking;
    onClose: () => void;
}

const StreetViewModal: React.FC<StreetViewModalProps> = ({ parking, onClose }) => {
    const streetViewRef = useRef<HTMLDivElement>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MapsCredential.mapsKey,
        libraries: ["streetView"],
    });

    useEffect(() => {
        if (isLoaded && streetViewRef.current) {
            initializeStreetView();
        }
    }, [isLoaded]);

    const initializeStreetView = () => {
        if (!streetViewRef.current) return;

        const position = {
            lat: parking.location.latitude,
            lng: parking.location.longitude,
        };

        // Configuración del Street View
        const panoramaOptions: google.maps.StreetViewPanoramaOptions = {
            position: position,
            pov: {
                heading: 0,
                pitch: 0,
            },
            zoom: 1,
            visible: true,
            enableCloseButton: false,
            showRoadLabels: true,
            clickToGo: true,
            scrollwheel: true,
            disableDefaultUI: false,
            panControl: true,
            zoomControl: true,
            addressControl: true,
            fullscreenControl: true,
            motionTracking: false,
            motionTrackingControl: false,
        };

        // Crear el panorama
        panoramaRef.current = new google.maps.StreetViewPanorama(
            streetViewRef.current,
            panoramaOptions
        );

        // Verificar si Street View está disponible en la ubicación
        const streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanorama({
            location: position,
            radius: 50, // 50 metros de radio de búsqueda
        }, (result, status) => {
            if (status === google.maps.StreetViewStatus.OK && panoramaRef.current) {
                console.log('✅ Street View disponible para:', parking.location.district);
                panoramaRef.current.setPano(result!.location!.pano);
            } else {
                console.log('⚠️ Street View no disponible para esta ubicación');
                showNoStreetViewMessage();
            }
        });
    };

    const showNoStreetViewMessage = () => {
        if (streetViewRef.current) {
            streetViewRef.current.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    background-color: #f3f4f6;
                    color: #6b7280;
                    text-align: center;
                    padding: 2rem;
                ">
                    <svg style="width: 64px; height: 64px; margin-bottom: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
                        Street View no disponible
                    </h3>
                    <p style="font-size: 0.875rem;">
                        No hay imágenes de Street View disponibles para esta ubicación específica.
                    </p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">
                        Ubicación: ${parking.location.district}, ${parking.location.city}
                    </p>
                </div>
            `;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Street View - {parking.location.district}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {parking.location.address}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200 p-2 rounded-full hover:bg-gray-100"
                        title="Cerrar Street View"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Street View Container */}
                <div className="relative">
                    {isLoaded ? (
                        <div
                            ref={streetViewRef}
                            className="w-full h-[600px]"
                            style={{ backgroundColor: '#f3f4f6' }}
                        />
                    ) : (
                        <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Cargando Street View...</p>
                            </div>
                        </div>
                    )}

                    {/* Info Panel */}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg max-w-xs">
                        <div className="text-sm">
                            <div className="font-medium text-gray-900 mb-1">
                                {parking.location.district}
                            </div>
                            <div className="text-gray-600 mb-2">
                                S/ {parking.price.toFixed(2)}/hora
                            </div>
                            <div className="text-xs text-gray-500">
                                {parking.space} espacio{parking.space !== 1 ? 's' : ''} disponible{parking.space !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Usa el mouse para explorar la vista 360°</span>
                        </div>
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Lat: {parking.location.latitude.toFixed(6)}, Lng: {parking.location.longitude.toFixed(6)}
                        </span>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                const url = `https://www.google.com/maps/@${parking.location.latitude},${parking.location.longitude},3a,75y,0h,90t/data=!3m7!1e1!3m5!1s0x0:0x0!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D0%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D0%26pitch%3D0%26thumbfov%3D100!7i16384!8i8192`;
                                window.open(url, '_blank');
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Abrir en Google Maps
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreetViewModal;