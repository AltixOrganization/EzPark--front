// src/app/parking/hooks/useParking.ts

import { useState, useEffect } from 'react';
import ParkingService from '../services/parkingService';
import type { 
    Parking, 
    CreateParkingRequest, 
    UpdateParkingRequest,
    MapLocation 
} from '../types/parking.types';
import { useAuth } from '../../shared/hooks/useAuth';

interface UseParkingReturn {
    // Estado
    parkings: Parking[];
    userParkings: Parking[];
    selectedParking: Parking | null;
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: string | null;

    // Métodos de CRUD
    createParking: (data: CreateParkingRequest) => Promise<boolean>;
    updateParking: (id: number, data: UpdateParkingRequest) => Promise<boolean>;
    deleteParking: (id: number) => Promise<boolean>;
    
    // Métodos de consulta
    loadAllParkings: () => Promise<void>;
    loadUserParkings: () => Promise<void>;
    loadParkingById: (id: number) => Promise<void>;
    searchNearbyParkings: (location: MapLocation) => Promise<void>;
    
    // Utilidades
    clearError: () => void;
    refreshData: () => Promise<void>;
}

export const useParking = (): UseParkingReturn => {
    // Estado principal
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [userParkings, setUserParkings] = useState<Parking[]>([]);
    const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
    
    // Estados de carga
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    // ===============================
    // MÉTODOS DE CARGA DE DATOS
    // ===============================

    const loadAllParkings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const allParkings = await ParkingService.getAllParkings();
            setParkings(allParkings);
            
            console.log('✅ Todos los estacionamientos cargados:', allParkings.length);
        } catch (err: any) {
            console.error('❌ Error al cargar estacionamientos:', err);
            setError(err.message || 'Error al cargar los estacionamientos');
        } finally {
            setLoading(false);
        }
    };

    const loadUserParkings = async () => {
        if (!isAuthenticated || !user) {
            setUserParkings([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const profileId = await ParkingService.getCurrentUserProfileId();
            const myParkings = await ParkingService.getParkingsByProfile(profileId);
            setUserParkings(myParkings);
            
            console.log('✅ Estacionamientos del usuario cargados:', myParkings.length);
        } catch (err: any) {
            console.error('❌ Error al cargar estacionamientos del usuario:', err);
            setError(err.message || 'Error al cargar tus estacionamientos');
        } finally {
            setLoading(false);
        }
    };

    const loadParkingById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const parking = await ParkingService.getParkingById(id);
            setSelectedParking(parking);
            
            console.log('✅ Estacionamiento cargado por ID:', parking);
        } catch (err: any) {
            console.error('❌ Error al cargar estacionamiento por ID:', err);
            setError(err.message || 'Error al cargar el estacionamiento');
        } finally {
            setLoading(false);
        }
    };

    const searchNearbyParkings = async (location: MapLocation) => {
        try {
            setLoading(true);
            setError(null);
            
            const nearbyParkings = await ParkingService.getNearbyParkings(location);
            setParkings(nearbyParkings);
            
            console.log('✅ Estacionamientos cercanos encontrados:', nearbyParkings.length);
        } catch (err: any) {
            console.error('❌ Error al buscar estacionamientos cercanos:', err);
            setError(err.message || 'Error al buscar estacionamientos cercanos');
        } finally {
            setLoading(false);
        }
    };

    // ===============================
    // MÉTODOS DE CRUD
    // ===============================

    const createParking = async (data: CreateParkingRequest): Promise<boolean> => {
        try {
            setCreating(true);
            setError(null);

            // Asegurarse de que el profileId esté configurado
            if (!data.profileId) {
                data.profileId = await ParkingService.getCurrentUserProfileId();
            }

            console.log('📝 Creando parking con profileId:', data.profileId);

            const newParking = await ParkingService.createParking(data);
            
            // Actualizar la lista de estacionamientos del usuario
            setUserParkings(prev => [...prev, newParking]);
            
            console.log('✅ Estacionamiento creado exitosamente:', newParking);
            return true;
        } catch (err: any) {
            console.error('❌ Error al crear estacionamiento:', err);
            setError(err.message || 'Error al crear el estacionamiento');
            return false;
        } finally {
            setCreating(false);
        }
    };

    const updateParking = async (id: number, data: UpdateParkingRequest): Promise<boolean> => {
        try {
            setUpdating(true);
            setError(null);

            const updatedParking = await ParkingService.updateParking(id, data);
            
            // Actualizar en todas las listas
            setParkings(prev => prev.map(p => p.id === id ? updatedParking : p));
            setUserParkings(prev => prev.map(p => p.id === id ? updatedParking : p));
            
            if (selectedParking?.id === id) {
                setSelectedParking(updatedParking);
            }
            
            console.log('✅ Estacionamiento actualizado exitosamente:', updatedParking);
            return true;
        } catch (err: any) {
            console.error('❌ Error al actualizar estacionamiento:', err);
            setError(err.message || 'Error al actualizar el estacionamiento');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const deleteParking = async (id: number): Promise<boolean> => {
        try {
            setDeleting(true);
            setError(null);

            await ParkingService.deleteParking(id);
            
            // Remover de todas las listas
            setParkings(prev => prev.filter(p => p.id !== id));
            setUserParkings(prev => prev.filter(p => p.id !== id));
            
            if (selectedParking?.id === id) {
                setSelectedParking(null);
            }
            
            console.log('✅ Estacionamiento eliminado exitosamente');
            return true;
        } catch (err: any) {
            console.error('❌ Error al eliminar estacionamiento:', err);
            setError(err.message || 'Error al eliminar el estacionamiento');
            return false;
        } finally {
            setDeleting(false);
        }
    };

    // ===============================
    // MÉTODOS UTILITARIOS
    // ===============================

    const clearError = () => {
        setError(null);
    };

    const refreshData = async () => {
        await Promise.all([
            loadAllParkings(),
            loadUserParkings()
        ]);
    };

    // ===============================
    // EFECTOS
    // ===============================

    // Cargar estacionamientos del usuario al montar el componente
    useEffect(() => {
        if (isAuthenticated) {
            loadUserParkings();
        }
    }, [isAuthenticated, user]);

    return {
        // Estado
        parkings,
        userParkings,
        selectedParking,
        loading,
        creating,
        updating,
        deleting,
        error,

        // Métodos de CRUD
        createParking,
        updateParking,
        deleteParking,
        
        // Métodos de consulta
        loadAllParkings,
        loadUserParkings,
        loadParkingById,
        searchNearbyParkings,
        
        // Utilidades
        clearError,
        refreshData
    };
};

export default useParking;