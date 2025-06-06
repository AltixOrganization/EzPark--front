// src/app/shared/providers/GoogleMapsProvider.tsx

import React, { createContext, useContext, type ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapsCredential from '../../credentials/MapsCredential';
import LoadingSpinner from '../components/LoadingSpinner';

// Configuración centralizada para todas las bibliotecas necesarias
const GOOGLE_MAPS_LIBRARIES: ("places" | "streetView")[] = ["places", "streetView"];

interface GoogleMapsContextType {
    isLoaded: boolean;
    loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

interface GoogleMapsProviderProps {
    children: ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: MapsCredential.mapsKey,
        libraries: GOOGLE_MAPS_LIBRARIES,
        // Configuraciones adicionales para evitar conflictos
        id: 'google-maps-script',
        language: 'es',
        region: 'PE',
        // Prevenir múltiples cargas
        preventGoogleFontsLoading: false,
    });

    const value: GoogleMapsContextType = {
        isLoaded,
        loadError,
    };

    return (
        <GoogleMapsContext.Provider value={value}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useGoogleMaps = (): GoogleMapsContextType => {
    const context = useContext(GoogleMapsContext);
    if (context === undefined) {
        throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
    }
    return context;
};

// HOC para componentes que necesitan Google Maps cargado
export const withGoogleMaps = <P extends object>(
    Component: React.ComponentType<P>
): React.ComponentType<P> => {
    return (props: P) => {
        const { isLoaded, loadError } = useGoogleMaps();

        if (loadError) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Error al cargar Google Maps</p>
                    </div>
                </div>
            );
        }

        if (!isLoaded) {
            return <LoadingSpinner text="Cargando Google Maps..." />;
        }

        return <Component {...props} />;
    };
};