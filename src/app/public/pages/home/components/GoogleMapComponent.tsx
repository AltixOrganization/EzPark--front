import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import MapsCredential from "../../../../credentials/MapsCredential.tsx";
import React, { useRef, useState } from "react";
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

const MapWithSearch: React.FC = () => {
    const [center, setCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MapsCredential.mapsKey,
        libraries: ["places"],
    });

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
                if (status === "OK" && results[0].geometry) {
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

    return isLoaded ? (
        <>
            <div className="Search-Container">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                >
                    <Marker position={markerPosition} />
                </GoogleMap>

                <div className="input-user-section">

                    <div className="input-section">
                        <h1>Encuentra tu garage</h1>

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
        </>
    ) : (
        <p>Cargando mapa...</p>
    );
};

export default MapWithSearch;