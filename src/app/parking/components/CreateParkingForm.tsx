// src/app/parking/components/CreateParkingForm.tsx (ACTUALIZADO)

import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { useGoogleMaps, withGoogleMaps } from "../../shared/providers/GoogleMapsProvider";
import { useParking } from "../hooks/useParking";
import type { ParkingFormData, CreateParkingRequest } from "../types/parking.types";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
};

const defaultCenter = {
    lat: -12.0464, // Lima
    lng: -77.0428,
};

const CreateParkingFormComponent: React.FC = () => {
    const navigate = useNavigate();
    const { isLoaded } = useGoogleMaps();
    const { createParking, creating, error, clearError } = useParking();
    
    // Estados del formulario
    const [formData, setFormData] = useState<ParkingFormData>({
        // Información básica del estacionamiento
        width: "",
        length: "",
        height: "",
        price: "",
        phone: "",
        space: "",
        description: "",
        
        // Información de ubicación
        address: "",
        numDirection: "",
        street: "",
        district: "",
        city: "",
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng,
    });

    // Estados del mapa
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const geocoder = useRef<google.maps.Geocoder | null>(null);

    // Estados de validación
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // ===============================
    // MANEJO DE FORMULARIO
    // ===============================

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Limpiar errores cuando el usuario empiece a escribir
        if (validationErrors.length > 0) {
            setValidationErrors([]);
        }
        if (error) {
            clearError();
        }
    };

    // ===============================
    // MANEJO DE GOOGLE MAPS
    // ===============================

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                const newCenter = {
                    lat: location.lat(),
                    lng: location.lng(),
                };
                
                setMapCenter(newCenter);
                setMarkerPosition(newCenter);
                
                // Actualizar datos del formulario con la información del lugar
                updateFormWithPlaceData(place, newCenter);
            }
        }
    };

    const updateFormWithPlaceData = (place: google.maps.places.PlaceResult, coordinates: { lat: number; lng: number }) => {
        // Extraer componentes de la dirección
        const addressComponents = place.address_components || [];
        let street = "";
        let district = "";
        let city = "";
        let numDirection = "";

        addressComponents.forEach(component => {
            const types = component.types;
            if (types.includes("route")) {
                street = component.long_name;
            } else if (types.includes("sublocality") || types.includes("neighborhood")) {
                district = component.long_name;
            } else if (types.includes("locality") || types.includes("administrative_area_level_2")) {
                city = component.long_name;
            } else if (types.includes("street_number")) {
                numDirection = component.long_name;
            }
        });

        setFormData(prev => ({
            ...prev,
            address: place.formatted_address || "",
            numDirection: numDirection || "S/N",
            street: street || "",
            district: district || "",
            city: city || "Lima",
            latitude: coordinates.lat,
            longitude: coordinates.lng,
        }));
    };

    const getAddressFromCoordinates = (lat: number, lng: number) => {
        if (!geocoder.current) {
            geocoder.current = new google.maps.Geocoder();
        }

        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                updateFormWithPlaceData(results[0], { lat, lng });
            } else {
                console.error("No se pudo obtener la dirección:", status);
                // Actualizar solo las coordenadas si no se puede obtener la dirección
                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                }));
            }
        });
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        const newPosition = {
            lat: e.latLng?.lat() || defaultCenter.lat,
            lng: e.latLng?.lng() || defaultCenter.lng,
        };
        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
        getAddressFromCoordinates(newPosition.lat, newPosition.lng);
    };

    // ===============================
    // VALIDACIÓN
    // ===============================

    const validateForm = (): string[] => {
        const errors: string[] = [];

        // Validar dimensiones
        const width = parseFloat(formData.width);
        const length = parseFloat(formData.length);
        const height = parseFloat(formData.height);

        if (!formData.width || isNaN(width) || width <= 0) {
            errors.push("El ancho debe ser un número mayor a 0");
        }
        if (!formData.length || isNaN(length) || length <= 0) {
            errors.push("El largo debe ser un número mayor a 0");
        }
        if (!formData.height || isNaN(height) || height <= 0) {
            errors.push("La altura debe ser un número mayor a 0");
        }

        // Validar precio
        const price = parseFloat(formData.price);
        if (!formData.price || isNaN(price) || price <= 0) {
            errors.push("El precio debe ser un número mayor a 0");
        }

        // Validar teléfono
        const phoneRegex = /^\+?[0-9]{9,15}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            errors.push("El teléfono debe tener entre 9 y 15 dígitos");
        }

        // Validar espacios
        const space = parseInt(formData.space);
        if (!formData.space || isNaN(space) || space <= 0) {
            errors.push("El número de espacios debe ser un número mayor a 0");
        }

        // Validar descripción
        if (!formData.description || formData.description.trim().length < 10) {
            errors.push("La descripción debe tener al menos 10 caracteres");
        }

        // Validar ubicación
        if (!formData.address || formData.address.trim().length === 0) {
            errors.push("La dirección es requerida");
        }
        if (!formData.district || formData.district.trim().length === 0) {
            errors.push("El distrito es requerido");
        }

        return errors;
    };

    // ===============================
    // ENVÍO DEL FORMULARIO
    // ===============================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors([]);
        setShowSuccess(false);

        // Validar formulario
        const errors = validateForm();
        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Preparar datos para enviar al backend
        const parkingData: CreateParkingRequest = {
            profileId: 0, // Se configurará automáticamente en el hook
            width: parseFloat(formData.width),
            length: parseFloat(formData.length),
            height: parseFloat(formData.height),
            price: parseFloat(formData.price),
            phone: formData.phone.replace(/\s/g, ''),
            space: parseInt(formData.space),
            description: formData.description.trim(),
            location: {
                address: formData.address.trim(),
                numDirection: formData.numDirection.trim() || "S/N",
                street: formData.street.trim() || "",
                district: formData.district.trim(),
                city: formData.city.trim() || "Lima",
                latitude: formData.latitude,
                longitude: formData.longitude,
            }
        };

        try {
            const success = await createParking(parkingData);
            if (success) {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/user-garages');
                }, 2000);
            }
        } catch (err) {
            console.error('Error al crear estacionamiento:', err);
        }
    };

    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Registra tu garaje</h1>
            
            {/* Mensaje de éxito */}
            {showSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        ¡Estacionamiento creado exitosamente! Redirigiendo...
                    </div>
                </div>
            )}

            {/* Errores de validación */}
            {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                    <h3 className="font-medium mb-2">Por favor corrige los siguientes errores:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                            <li key={index} className="text-sm">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Error del backend */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                    <p>{error}</p>
                </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna izquierda - Formulario */}
                <div className="w-full lg:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Ubicación con autocompletado */}
                        <div>
                            <label htmlFor="location-search" className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar ubicación
                            </label>
                            {isLoaded && (
                                <Autocomplete
                                    onLoad={(autocomplete) => {
                                        autocompleteRef.current = autocomplete;
                                    }}
                                    onPlaceChanged={onPlaceChanged}
                                    restrictions={{ country: "pe" }}
                                >
                                    <input
                                        type="text"
                                        id="location-search"
                                        placeholder="Buscar dirección en Perú"
                                        ref={inputRef}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </Autocomplete>
                            )}
                        </div>

                        {/* Información de ubicación */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Dirección completa
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="numDirection" className="block text-sm font-medium text-gray-700 mb-1">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    id="numDirection"
                                    name="numDirection"
                                    value={formData.numDirection}
                                    onChange={handleInputChange}
                                    placeholder="123 o S/N"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                                    Calle
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                    Distrito *
                                </label>
                                <input
                                    type="text"
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Información del estacionamiento */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del estacionamiento</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ancho (m) *
                                    </label>
                                    <input
                                        type="number"
                                        id="width"
                                        name="width"
                                        value={formData.width}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                                        Largo (m) *
                                    </label>
                                    <input
                                        type="number"
                                        id="length"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                                        Altura (m) *
                                    </label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio por hora (S/) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.50"
                                        min="0.50"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="space" className="block text-sm font-medium text-gray-700 mb-1">
                                        Espacios disponibles *
                                    </label>
                                    <input
                                        type="number"
                                        id="space"
                                        name="space"
                                        value={formData.space}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono de contacto *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+51 999 999 999"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Describe tu estacionamiento: características especiales, instrucciones de acceso, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Mínimo 10 caracteres. Actual: {formData.description.length}
                                </p>
                            </div>
                        </div>
                        
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {creating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando estacionamiento...
                                    </>
                                ) : (
                                    'Registrar Estacionamiento'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Columna derecha - Mapa */}
                <div className="w-full lg:w-1/2 h-[600px]">
                    <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={mapCenter}
                                zoom={14}
                                onClick={handleMapClick}
                            >
                                <Marker position={markerPosition} />
                            </GoogleMap>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-lg text-gray-600">Cargando mapa...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Haz clic en el mapa para seleccionar la ubicación exacta
                    </p>
                </div>
            </div>
        </div>
    );
};

// Envolver el componente con el HOC withGoogleMaps
const CreateParkingForm = withGoogleMaps(CreateParkingFormComponent);

export default CreateParkingForm;