import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import React, { useRef, useState, useEffect } from "react";
import { useGoogleMaps, withGoogleMaps } from "../../../../shared/providers/GoogleMapsProvider";
import { ParkingService } from "../../../../parking/services/parkingService";
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
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { isLoaded } = useGoogleMaps();

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
                {/* Marcador de búsqueda del usuario */}
                <Marker 
                    position={markerPosition}
                    icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563eb"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
                        scaledSize: new google.maps.Size(40, 40),
                        anchor: new google.maps.Point(20, 40)
                    }}
                    title="Tu búsqueda"
                />
                
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
                        onClick={() => {
                            // Al hacer clic, mostrar información del estacionamiento
                            console.log('🅿️ Estacionamiento seleccionado:', parking);
                            // Opcional: mostrar un modal o info window con detalles
                        }}
                    />
                ))}
            </GoogleMap>

            <div className="input-user-section">
                <div className="input-section">
                    <h1>Encuentra tu garage</h1>
                    
                    {parkings.length > 0 && (
                        <p className="text-sm text-gray-600 mb-3">
                            📍 {parkings.length} estacionamientos disponibles
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