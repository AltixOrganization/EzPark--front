// src/app/parking/pages/SearchMapPage.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useParking } from '../hooks/useParking';
import { useGoogleMaps, withGoogleMaps } from '../../shared/providers/GoogleMapsProvider';
import { useGeolocation } from '../../shared/hooks/useGeolocation';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import ParkingCard from '../components/ParkingCard';
import ParkingDetailsModal from '../components/ParkingDetailsModal';
import ParkingInfoWindow from '../../public/pages/home/components/ParkingInfoWindow';
import type { Parking } from '../types/parking.types';

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "15px",
    minHeight: "600px",
};

const defaultCenter = {
    lat: -12.0464, // Lima
    lng: -77.0428,
};

const SearchMapPageComponent: React.FC = () => {
    const { 
        parkings, 
        loading, 
        error, 
        loadAllParkings,
    } = useParking();

    const { isLoaded } = useGoogleMaps();
    
    // Estados para el mapa
    const [center, setCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
    const [hasSetInitialLocation, setHasSetInitialLocation] = useState(false);
    const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Estados para filtros y búsqueda
    const [searchLocation, setSearchLocation] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'distance' | 'recent'>('recent');
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(50);
    const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');

    // Estados para modales
    const [viewingParking, setViewingParking] = useState<Parking | null>(null);

    // Hook para obtener ubicación del usuario
    const {
        coordinates: userLocation,
        loading: locationLoading,
        requestLocation
    } = useGeolocation();

    // Cargar datos iniciales
    useEffect(() => {
        loadAllParkings();
    }, [loadAllParkings]);

    // Usar ubicación del usuario como centro inicial cuando esté disponible
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
        }, 5000);

        return () => clearTimeout(timer);
    }, [userLocation, hasSetInitialLocation]);

    // Handlers para el mapa
    const onPlaceChanged = useCallback(() => {
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
                if (place.formatted_address) {
                    setSearchLocation(place.formatted_address);
                }
            }
        }
    }, []);

    const handleManualSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
                    setSearchLocation(results[0].formatted_address || address);
                } else {
                    console.error("Geocoding failed: ", status);
                }
            });
        }
    }, []);

    // Handlers para parking
    const handleParkingClick = useCallback((parking: Parking) => {
        setSelectedParking(parking);
        console.log('🅿️ Estacionamiento seleccionado:', parking);
    }, []);

    const handleCloseInfoWindow = useCallback(() => {
        setSelectedParking(null);
    }, []);

    const handleViewParking = useCallback((parking: Parking) => {
        setViewingParking(parking);
    }, []);

    const handleReserveParking = useCallback((parking: Parking) => {
        // TODO: Implementar funcionalidad de reserva
        alert(`¡Funcionalidad de reserva para ${parking.location.district} próximamente!`);
    }, []);

    const handleSearchLocation = useCallback(() => {
        // TODO: Implementar búsqueda por ubicación
        alert(`Búsqueda por "${searchLocation}" próximamente!`);
    }, [searchLocation]);

    // Filtrar y ordenar estacionamientos
    const filteredAndSortedParkings = React.useMemo(() => {
        let filtered = [...parkings];

        // Aplicar filtro de precio
        if (priceFilter !== 'all') {
            switch (priceFilter) {
                case 'low':
                    filtered = filtered.filter(p => p.price <= 10);
                    break;
                case 'medium':
                    filtered = filtered.filter(p => p.price > 10 && p.price <= 25);
                    break;
                case 'high':
                    filtered = filtered.filter(p => p.price > 25);
                    break;
            }
        }

        // Aplicar filtro de rango de precio
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // Solo mostrar estacionamientos con espacios disponibles
        filtered = filtered.filter(p => p.space > 0);

        // Aplicar ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'distance':
                    // TODO: Implementar ordenamiento por distancia
                    return 0;
                case 'recent':
                default:
                    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
            }
        });

        return filtered;
    }, [parkings, priceFilter, sortBy, minPrice, maxPrice]);

    // Estadísticas de la búsqueda
    const searchStats = {
        total: parkings.length,
        available: parkings.filter(p => p.space > 0).length,
        filtered: filteredAndSortedParkings.length,
        avgPrice: filteredAndSortedParkings.length > 0 
            ? (filteredAndSortedParkings.reduce((sum, p) => sum + p.price, 0) / filteredAndSortedParkings.length).toFixed(2)
            : '0.00'
    };

    if (loading && parkings.length === 0) {
        return <LoadingSpinner fullScreen text="Cargando estacionamientos..." />;
    }

    return (
        <div className="h-screen bg-gray-50 overflow-hidden">
            <div className="container mx-auto py-1 px-2 md:px-4 h-full flex flex-col">
                <div className="max-w-none mx-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-3 md:mb-4 flex-shrink-0">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                            Buscar Estacionamientos
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Encuentra y reserva espacios de estacionamiento cerca de ti
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex-shrink-0">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-md p-3 md:p-4 mb-3 flex-shrink-0">
                        {/* Search Bar */}
                        <div className="mb-4">
                            <label htmlFor="search-location" className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar ubicación
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {isLoaded && (
                                    <Autocomplete
                                        onLoad={(autocomplete) => {
                                            autocompleteRef.current = autocomplete;
                                            autocomplete.setComponentRestrictions({
                                                country: "pe",
                                            });
                                        }}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            id="search-location"
                                            value={searchLocation}
                                            onChange={(e) => setSearchLocation(e.target.value)}
                                            placeholder="Ej: Miraflores, San Isidro, Lima Centro..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                                            onKeyDown={handleManualSearch}
                                        />
                                    </Autocomplete>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSearchLocation}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span className="hidden sm:inline">Buscar</span>
                                    </button>
                                    {!userLocation && !locationLoading && (
                                        <button
                                            onClick={requestLocation}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
                                            title="Usar mi ubicación"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="hidden sm:inline">Mi ubicación</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="mb-4 flex justify-center">
                            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                        viewMode === 'map' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        <span className="hidden sm:inline">Mapa</span>
                                    </span>
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                        viewMode === 'split' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        <span className="hidden sm:inline">Mixto</span>
                                    </span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                        <span className="hidden sm:inline">Lista</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                <select 
                                    value={priceFilter} 
                                    onChange={(e) => setPriceFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Todos los precios</option>
                                    <option value="low">Económico (≤ S/ 10)</option>
                                    <option value="medium">Moderado (S/ 11-25)</option>
                                    <option value="high">Premium (&gt; S/ 25)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min: S/ {minPrice}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="1"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max: S/ {maxPrice}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="1"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'distance' | 'recent')}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="recent">Más recientes</option>
                                    <option value="price-asc">Precio: menor a mayor</option>
                                    <option value="price-desc">Precio: mayor a menor</option>
                                    <option value="distance">Distancia (próximamente)</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setPriceFilter('all');
                                    setSortBy('recent');
                                    setMinPrice(0);
                                    setMaxPrice(50);
                                    setSearchLocation('');
                                }}
                                className="text-gray-600 hover:text-gray-800 text-sm underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 bg-blue-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-blue-600">{searchStats.filtered}</p>
                                <p className="text-xs md:text-sm text-gray-600">Resultados</p>
                            </div>
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-green-600">{searchStats.available}</p>
                                <p className="text-xs md:text-sm text-gray-600">Disponibles</p>
                            </div>
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-purple-600">S/ {searchStats.avgPrice}</p>
                                <p className="text-xs md:text-sm text-gray-600">Precio promedio</p>
                            </div>
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-orange-600">{searchStats.total}</p>
                                <p className="text-xs md:text-sm text-gray-600">Total registrados</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className={`grid ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-4 flex-1 min-h-0`}>
                        {/* Map View */}
                        {(viewMode === 'map' || viewMode === 'split') && (
                            <div className={`${viewMode === 'map' ? 'col-span-full' : ''} h-full`}>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                                    {isLoaded ? (
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={center}
                                            zoom={14}
                                            options={{
                                                streetViewControl: false,
                                                mapTypeControl: false,
                                                fullscreenControl: true,
                                            }}
                                        >
                                            {/* Marcador de ubicación del usuario */}
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
                                                    zIndex={1000}
                                                />
                                            )}

                                            {/* Marcador de búsqueda */}
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
                                            {filteredAndSortedParkings.map((parking) => (
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
                                                    onViewDetails={handleViewParking}
                                                    onReserve={handleReserveParking}
                                                    averageRating={4.2}
                                                    totalReviews={15}
                                                />
                                            )}
                                        </GoogleMap>
                                    ) : (
                                        <div className="h-full flex items-center justify-center bg-gray-100">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                                <p className="text-lg text-gray-600">Cargando mapa...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* List View */}
                        {(viewMode === 'list' || viewMode === 'split') && (
                            <div className={`${viewMode === 'list' ? 'col-span-full' : ''} h-full`}>
                                <div className="h-full overflow-y-auto">
                                    {filteredAndSortedParkings.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                            <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                                No se encontraron estacionamientos
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Intenta ajustar tus filtros de búsqueda o explora otras ubicaciones.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-white rounded-lg shadow-sm p-4">
                                                <p className="text-gray-600 text-sm">
                                                    Mostrando {filteredAndSortedParkings.length} de {searchStats.available} estacionamientos disponibles
                                                </p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                {filteredAndSortedParkings.map((parking) => (
                                                    <ParkingCard
                                                        key={parking.id}
                                                        parking={parking}
                                                        onView={() => handleViewParking(parking)}
                                                        onReserve={() => handleReserveParking(parking)}
                                                        isOwner={false}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de detalles */}
            {viewingParking && (
                <ParkingDetailsModal
                    parking={viewingParking}
                    onClose={() => setViewingParking(null)}
                    isOwner={false}
                />
            )}
        </div>
    );
};

// Envolver el componente con el HOC withGoogleMaps
const SearchMapPage = withGoogleMaps(SearchMapPageComponent);

export default SearchMapPage;
