import React, { useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import MapsCredential from "../../../credentials/MapsCredential.tsx";

const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "10px",
};

const defaultCenter = {
    lat: -12.0464, // Lima
    lng: -77.0428,
};

const PublishGarage: React.FC = () => {
    const [formData, setFormData] = useState({
        address: "",
        title: "",
        description: "",
        length: "",
        width: "",
        height: "",
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
                setFormData((prev) => ({ ...prev, address: place.formatted_address || "" }));
            }
        }
    };

    const getAddressFromCoordinates = (lat: number, lng: number) => {
        if (!geocoder.current) {
            geocoder.current = new google.maps.Geocoder();
        }

        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                setFormData((prev) => ({ ...prev, address: results[0].formatted_address }));
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
        <div>
            <h1>Publicar Garaje</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Dirección:</label>
                    <Autocomplete
                        onLoad={(autocomplete) => {
                            autocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Selecciona o ingresa una dirección"
                            ref={inputRef}
                            style={{
                                width: "100%",
                                height: "40px",
                                borderRadius: "5px",
                                marginBottom: "10px",
                            }}
                        />
                    </Autocomplete>
                </div>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Título del garaje"
                        style={{ width: "100%", height: "40px", borderRadius: "5px", marginBottom: "10px" }}
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Breve descripción del garaje"
                        style={{ width: "100%", height: "80px", borderRadius: "5px", marginBottom: "10px" }}
                    />
                </div>
                <div>
                    <label>Medidas (en metros):</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleInputChange}
                            placeholder="Largo"
                            style={{ width: "100px", borderRadius: "5px" }}
                        />
                        <input
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleInputChange}
                            placeholder="Ancho"
                            style={{ width: "100px", borderRadius: "5px" }}
                        />
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            placeholder="Alto"
                            style={{ width: "100px", borderRadius: "5px" }}
                        />
                    </div>
                </div>
                <button type="submit" style={{ marginTop: "20px", padding: "10px 20px", borderRadius: "5px" }}>
                    Publicar Garaje
                </button>
            </form>

            <h2>Selecciona la ubicación en el mapa:</h2>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                onClick={handleMapClick}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </div>
    ) : (
        <p>Cargando mapa...</p>
    );
};

export default PublishGarage;