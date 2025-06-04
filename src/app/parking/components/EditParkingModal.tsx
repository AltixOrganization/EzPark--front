// src/app/parking/components/EditParkingModal.tsx

import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import MapsCredential from "../../credentials/MapsCredential";
import { useParking } from "../hooks/useParking";
import type { Parking, ParkingFormData, UpdateParkingRequest } from "../types/parking.types";

const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
};

interface EditParkingModalProps {
    parking: Parking;
    onClose: () => void;
}

const EditParkingModal: React.FC<EditParkingModalProps> = ({ parking, onClose }) => {
    const { updateParking, updating, error, clearError } = useParking();
    
    // Estados del formulario
    const [formData, setFormData] = useState<ParkingFormData>({
        width: parking.width.toString(),
        length: parking.length.toString(),
        height: parking.height.toString(),
        price: parking.price.toString(),
        phone: parking.phone,
        space: parking.space.toString(),
        description: parking.description,
        address: parking.location.address,
        numDirection: parking.location.numDirection,
        street: parking.location.street,
        district: parking.location.district,
        city: parking.location.city,
        latitude: parking.location.latitude,
        longitude: parking.location.longitude,
    });

    // Estados del mapa
    const [mapCenter, setMapCenter] = useState({
        lat: parking.location.latitude,
        lng: parking.location.longitude,
    });
    const [markerPosition, setMarkerPosition] = useState({
        lat: parking.location.latitude,
        lng: parking.location.longitude,
    });

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoder = useRef<google.maps.Geocoder | null>(null);

    // Estados de validación
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MapsCredential.mapsKey,
        libraries: ["places"],
    });

    // ===============================
    // EFECTOS
    // ===============================

    useEffect(() => {
        // Limpiar errores cuando se abre el modal
        clearError();
        setValidationErrors([]);
    }, [clearError]);

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
                updateFormWithPlaceData(place, newCenter);
            }
        }
    };

    const updateFormWithPlaceData = (place: google.maps.places.PlaceResult, coordinates: { lat: number; lng: number }) => {
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
            address: place.formatted_address || prev.address,
            numDirection: numDirection || prev.numDirection,
            street: street || prev.street,
            district: district || prev.district,
            city: city || prev.city,
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
            lat: e.latLng?.lat() || mapCenter.lat,
            lng: e.latLng?.lng() || mapCenter.lng,
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

        // Verificar si hay cambios
        const hasChanges = 
            formData.width !== parking.width.toString() ||
            formData.length !== parking.length.toString() ||
            formData.height !== parking.height.toString() ||
            formData.price !== parking.price.toString() ||
            formData.phone !== parking.phone ||
            formData.space !== parking.space.toString() ||
            formData.description !== parking.description ||
            formData.address !== parking.location.address ||
            formData.numDirection !== parking.location.numDirection ||
            formData.street !== parking.location.street ||
            formData.district !== parking.location.district ||
            formData.city !== parking.location.city ||
            formData.latitude !== parking.location.latitude ||
            formData.longitude !== parking.location.longitude;

        if (!hasChanges) {
            setValidationErrors(["No hay cambios para guardar"]);
            return;
        }

        // Preparar datos para actualizar
        const updateData: UpdateParkingRequest = {
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
            const success = await updateParking(parking.id!, updateData);
            if (success) {
                setShowSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (err) {
            console.error('Error al actualizar estacionamiento:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Editar Estacionamiento
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200"
                        disabled={updating}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Mensaje de éxito */}
                    {showSuccess && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                ¡Estacionamiento actualizado exitosamente!
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

                    {isLoaded ? (
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Formulario */}
                            <div className="w-full lg:w-1/2">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Ubicación con autocompletado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Buscar nueva ubicación
                                        </label>
                                        <Autocomplete
                                            onLoad={(autocomplete) => {
                                                autocompleteRef.current = autocomplete;
                                            }}
                                            onPlaceChanged={onPlaceChanged}
                                            restrictions={{ country: "pe" }}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Buscar dirección en Perú"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </Autocomplete>
                                    </div>

                                    {/* Información de ubicación */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                Dirección
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
                                            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                                Distrito
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

                                    {/* Dimensiones */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                                                Ancho (m)
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
                                                Largo (m)
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
                                                Altura (m)
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

                                    {/* Precio, espacios y teléfono */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                                Precio/hora (S/)
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
                                                Espacios
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
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Caracteres: {formData.description.length}
                                        </p>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                                            disabled={updating}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {updating ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Actualizando...
                                                </>
                                            ) : (
                                                'Guardar cambios'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Mapa */}
                            <div className="w-full lg:w-1/2">
                                <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={mapCenter}
                                        zoom={14}
                                        onClick={handleMapClick}
                                    >
                                        <Marker position={markerPosition} />
                                    </GoogleMap>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Haz clic en el mapa para actualizar la ubicación
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Cargando mapa...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditParkingModal;