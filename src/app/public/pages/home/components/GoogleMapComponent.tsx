import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps, withGoogleMaps } from "../../../../shared/providers/GoogleMapsProvider";
import { ParkingService } from "../../../../parking/services/parkingService";
import { useGeolocation } from "../../../../shared/hooks/useGeolocation";
import ParkingInfoWindow from "./ParkingInfoWindow";
import type { Parking } from "../../../../parking/types/parking.types";
import './home.css';

const containerStyle = {
    width: "78%",
    height: "770px",
    borderRadius: "27px",
};

const defaultCenter = {
    lat: -12.0464, // Lima
    lng: -77.0428,
};

const MapWithSearchComponent: React.FC = () => {
    const [center, setCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
    const [hasSetInitialLocation, setHasSetInitialLocation] = useState(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { isLoaded } = useGoogleMaps();
    const navigate = useNavigate();

    // Hook para obtener ubicación del usuario
    const {
        coordinates: userLocation,
        loading: locationLoading,
        error: locationError,
        requestLocation
    } = useGeolocation();

    // SIEMPRE usar ubicación del usuario como centro inicial cuando esté disponible
    useEffect(() => {
        if (userLocation && !hasSetInitialLocation) {
            const userCenter = {
                lat: userLocation.lat,
                lng: userLocation.lng
            };
            setCenter(userCenter);
            setMarkerPosition(userCenter);
            setHasSetInitialLocation(true);
            console.log('📍 Centro del mapa establecido en ubicación del usuario:', userCenter);
        }
    }, [userLocation, hasSetInitialLocation]);

    // Si no hay ubicación del usuario después de un tiempo, mantener centro por defecto
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!userLocation && !hasSetInitialLocation) {
                console.log('📍 Usando ubicación por defecto (Lima) - no se pudo obtener ubicación del usuario');
                setHasSetInitialLocation(true);
            }
        }, 5000); // Esperar 5 segundos para la ubicación del usuario

        return () => clearTimeout(timer);
    }, [userLocation, hasSetInitialLocation]);

    // Cargar todos los estacionamientos al montar el componente
    useEffect(() => {
        const loadParkings = async () => {
            setLoading(true);
            try {
                const allParkings = await ParkingService.getAllParkings();
                setParkings(allParkings);
                console.log('📍 Estacionamientos cargados para el mapa:', allParkings.length);
            } catch (error) {
                console.error('❌ Error al cargar estacionamientos para el mapa:', error);
                // En caso de error, mantener el array vacío
                setParkings([]);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) {
            loadParkings();
        }
    }, [isLoaded]);

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                const newCenter = {
                    lat: location.lat(),
                    lng: location.lng(),
                };
                setCenter(newCenter);
                setMarkerPosition(newCenter);
            }
        }
    };

    const handleManualSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputRef.current) {
            e.preventDefault();
            const address = inputRef.current.value;
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results && results[0] && results[0].geometry) {
                    const location = results[0].geometry.location;
                    const newCenter = {
                        lat: location.lat(),
                        lng: location.lng(),
                    };
                    setCenter(newCenter);
                    setMarkerPosition(newCenter);
                } else {
                    console.error("Geocoding failed: ", status);
                }
            });
        }
    };

    // Funciones para manejar el InfoWindow
    const handleParkingClick = (parking: Parking) => {
        setSelectedParking(parking);
        console.log('🅿️ Estacionamiento seleccionado:', parking);
    };

    const handleCloseInfoWindow = () => {
        setSelectedParking(null);
    };

    const handleViewDetails = (parking: Parking) => {
        // Navegar a la página de detalles del estacionamiento
        navigate(`/parking/${parking.id}`);
    };

    const handleReserve = (parking: Parking) => {
        // Navegar a la página de reserva
        navigate(`/reserve/${parking.id}`);
    };

    if (!isLoaded || loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">
                        {!isLoaded ? 'Cargando mapa...' : 'Cargando estacionamientos...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="Search-Container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
            >
                {/* Marcador de ubicación del usuario (si está disponible) */}
                {userLocation && (
                    <Marker
                        position={{
                            lat: userLocation.lat,
                            lng: userLocation.lng
                        }}
                        icon={{
                            url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23059669"%3E%3Ccircle cx="12" cy="12" r="8" fill="%23059669"/%3E%3Ccircle cx="12" cy="12" r="3" fill="%23ffffff"/%3E%3C/svg%3E',
                            scaledSize: new google.maps.Size(25, 25),
                            anchor: new google.maps.Point(12.5, 12.5)
                        }}
                        title="Tu ubicación actual"
                        zIndex={1000} // Asegurar que esté por encima de otros marcadores
                    />
                )}

                {/* Marcador de búsqueda del usuario (solo si es diferente a la ubicación actual) */}
                {(!userLocation ||
                    (markerPosition.lat !== userLocation.lat || markerPosition.lng !== userLocation.lng)) && (
                        <Marker
                            position={markerPosition}
                            icon={{
                                url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563eb"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
                                scaledSize: new google.maps.Size(40, 40),
                                anchor: new google.maps.Point(20, 40)
                            }}
                            title="Ubicación de búsqueda"
                        />
                    )}

                {/* Marcadores de estacionamientos */}
                {parkings.map((parking) => (
                    <Marker
                        key={parking.id}
                        position={{
                            lat: parking.location.latitude,
                            lng: parking.location.longitude
                        }}
                        icon={{
                            url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
                            scaledSize: new google.maps.Size(30, 30),
                            anchor: new google.maps.Point(15, 30)
                        }}
                        title={`Estacionamiento en ${parking.location.address}`}
                        onClick={() => handleParkingClick(parking)}
                    />
                ))}

                {/* InfoWindow para estacionamiento seleccionado */}
                {selectedParking && (
                    <ParkingInfoWindow
                        parking={selectedParking}
                        onClose={handleCloseInfoWindow}
                        onViewDetails={handleViewDetails}
                        onReserve={handleReserve}
                        averageRating={4.2} // Por ahora hardcodeado, después se puede obtener del backend
                        totalReviews={15}
                    />
                )}
            </GoogleMap>

            <div className="input-user-section">
                <div className="input-section">
                    <h1>Encuentra tu garage</h1>

                    {parkings.length > 0 && (
                        <p className="text-sm text-gray-600 mb-3">
                            📍 {parkings.length} estacionamientos disponibles
                        </p>
                    )}

                    {/* Botón para obtener/re-centrar ubicación */}
                    <div className="flex space-x-2 mb-3">
                        {!userLocation && !locationLoading && (
                            <button
                                onClick={requestLocation}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Usar mi ubicación</span>
                            </button>
                        )}

                        {userLocation && (
                            <button
                                onClick={() => {
                                    const userCenter = {
                                        lat: userLocation.lat,
                                        lng: userLocation.lng
                                    };
                                    setCenter(userCenter);
                                    setMarkerPosition(userCenter);
                                    console.log('📍 Mapa re-centrado en ubicación del usuario');
                                }}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                                title="Volver a mi ubicación"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 4.9V17L12 22l-9-5V6.9L12 2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                                <span>Mi ubicación</span>
                            </button>
                        )}
                    </div>

                    {/* Estado de carga de ubicación */}
                    {locationLoading && (
                        <p className="text-sm text-blue-600 mb-3 flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Obteniendo ubicación...
                        </p>
                    )}

                    {/* Error de ubicación */}
                    {locationError && (
                        <p className="text-sm text-red-600 mb-3">
                            ⚠️ {locationError}
                        </p>
                    )}

                    {/* Confirmación de ubicación obtenida */}
                    {userLocation && (
                        <p className="text-sm text-green-600 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Mapa centrado en tu ubicación actual
                        </p>
                    )}

                    <Autocomplete
                        onLoad={(autocomplete) => {
                            autocompleteRef.current = autocomplete;
                            autocomplete.setComponentRestrictions({
                                country: "pe", // Código de país para Perú
                            });
                        }}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Busca una dirección"
                            style={{
                                width: "90%",
                                height: "40px",
                                fontSize: "16px",
                                borderRadius: "10px",
                            }}
                            onKeyDown={handleManualSearch}
                        />
                    </Autocomplete>
                </div>
            </div>
        </div>
    );
};

// Envolver el componente con el HOC withGoogleMaps
const MapWithSearch = withGoogleMaps(MapWithSearchComponent);

export default MapWithSearch;