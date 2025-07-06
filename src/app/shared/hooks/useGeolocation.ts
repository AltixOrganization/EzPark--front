// src/app/shared/hooks/useGeolocation.ts

import { useState, useEffect } from 'react';

interface GeolocationCoordinates {
    lat: number;
    lng: number;
}

interface UseGeolocationReturn {
    coordinates: GeolocationCoordinates | null;
    loading: boolean;
    error: string | null;
    requestLocation: () => void;
    hasPermission: boolean;
}

export const useGeolocation = (): UseGeolocationReturn => {
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocalización no es soportada por este navegador');
            return;
        }

        setLoading(true);
        setError(null);

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 10000, // 10 segundos
            maximumAge: 300000 // 5 minutos
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({
                    lat: latitude,
                    lng: longitude
                });
                setHasPermission(true);
                setLoading(false);
                console.log('📍 Ubicación obtenida:', { lat: latitude, lng: longitude });
            },
            (err) => {
                let errorMessage = 'Error al obtener ubicación';
                
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado. Por favor habilita la ubicación en tu navegador.';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'Información de ubicación no disponible.';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'Tiempo de espera agotado al obtener ubicación.';
                        break;
                    default:
                        errorMessage = 'Error desconocido al obtener ubicación.';
                        break;
                }
                
                setError(errorMessage);
                setLoading(false);
                console.error('❌ Error de geolocalización:', err);
            },
            options
        );
    };

    // SIEMPRE intentar obtener ubicación al montar el componente
    useEffect(() => {
        // Siempre solicitar ubicación inmediatamente
        requestLocation();
        
        // También verificar permisos en background para futuros usos
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'granted') {
                    setHasPermission(true);
                } else if (result.state === 'denied') {
                    setHasPermission(false);
                }
                // Para 'prompt' no hacemos nada ya que requestLocation() ya se ejecutó
            }).catch(() => {
                // Si falla la query de permisos, no importa, ya llamamos requestLocation()
                console.log('No se pudo verificar permisos, pero ya se solicitó ubicación');
            });
        }
    }, []);

    return {
        coordinates,
        loading,
        error,
        requestLocation,
        hasPermission
    };
};

export default useGeolocation;
