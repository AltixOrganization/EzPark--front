import React, { useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import MapsCredential from "../../../credentials/MapsCredential.tsx";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
};

const defaultCenter = {
    lat: -12.0464, // Lima
    lng: -77.0428,
};

const PublishGarage: React.FC = () => {
    const [formData, setFormData] = useState({
        location: "",
        address: "",
        postalCode: "",
        document: "",
        details: ""
    });

    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const geocoder = useRef<google.maps.Geocoder | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MapsCredential.mapsKey,
        libraries: ["places"],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
                setFormData((prev) => ({ 
                    ...prev, 
                    location: place.formatted_address || "",
                    address: place.formatted_address || "" 
                }));
            }
        }
    };

    const getAddressFromCoordinates = (lat: number, lng: number) => {
        if (!geocoder.current) {
            geocoder.current = new google.maps.Geocoder();
        }

        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                setFormData((prev) => ({ 
                    ...prev, 
                    location: results[0].formatted_address || "",
                    address: results[0].formatted_address || "" 
                }));
            } else {
                console.error("No se pudo obtener la dirección:", status);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos del formulario:", formData);
        // Aquí puedes enviar los datos al backend
    };

    return isLoaded ? (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-xl font-bold mb-6">Registra tu garaje</h1>
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna izquierda - Formulario */}
                <div className="w-full lg:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Ubicación
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
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Buscar dirección"
                                    ref={inputRef}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </Autocomplete>
                        </div>
                        
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
                                />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                                Documento
                            </label>
                            <input
                                type="text"
                                id="document"
                                name="document"
                                value={formData.document}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                                Detalles adicionales
                            </label>
                            <input
                                type="text"
                                id="details"
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button
                                type="button"
                                className="w-full mb-2 bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Subir Documentos
                            </button>
                            
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Registrar
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Columna derecha - Mapa */}
                <div className="w-full lg:w-1/2 h-[500px]">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={14}
                        onClick={handleMapClick}
                    >
                        <Marker position={markerPosition} />
                    </GoogleMap>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex justify-center items-center h-[500px]">
            <p className="text-lg">Cargando mapa...</p>
        </div>
    );
};

export default PublishGarage;