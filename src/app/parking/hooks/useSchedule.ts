// src/app/parking/hooks/useSchedule.ts

import { useState } from 'react';
import ScheduleService from '../services/scheduleService';
import type { 
    Schedule, 
    CreateScheduleRequest, 
    UpdateScheduleRequest 
} from '../types/schedule.types';

interface UseScheduleReturn {
    // Estado
    schedules: Schedule[];
    loading: boolean;
    creating: boolean;
    updating: boolean;
    error: string | null;

    // Métodos
    loadAllSchedules: () => Promise<void>;
    createSchedule: (data: CreateScheduleRequest) => Promise<boolean>;
    updateSchedule: (id: number, data: UpdateScheduleRequest) => Promise<boolean>;
    getScheduleById: (id: number) => Promise<Schedule | null>;
    
    // Utilidades
    clearError: () => void;
    getSchedulesByParking: (parkingId: number) => Schedule[];
}

export const useSchedule = (): UseScheduleReturn => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los horarios
    const loadAllSchedules = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const allSchedules = await ScheduleService.getAllSchedules();
            setSchedules(allSchedules);
            
        } catch (err: any) {
            console.error('Error al cargar horarios:', err);
            setError(err.message || 'Error al cargar los horarios');
        } finally {
            setLoading(false);
        }
    };

    // Crear nuevo horario
    const createSchedule = async (data: CreateScheduleRequest): Promise<boolean> => {
        try {
            setCreating(true);
            setError(null);

            // Función para formatear tiempo a HH:MM:SS
            const formatTime = (time: string): string => {
                const timeParts = time.split(':');
                if (timeParts.length === 2) {
                    return `${time}:00`; // Agregar :00 si solo tiene HH:MM
                } else if (timeParts.length === 3) {
                    return time; // Ya tiene el formato correcto
                } else {
                    throw new Error(`Formato de tiempo inválido: ${time}`);
                }
            };

            // Formatear los datos antes de enviarlos
            const formattedData: CreateScheduleRequest = {
                ...data,
                startTime: formatTime(data.startTime),
                endTime: formatTime(data.endTime)
            };

            console.log('📅 Data being sent to service:', formattedData);
            
            const newSchedule = await ScheduleService.createSchedule(formattedData);
            setSchedules(prev => [...prev, newSchedule]);
            
            console.log('✅ Horario creado exitosamente:', newSchedule);
            return true;
        } catch (err: any) {
            console.error('Error al crear horario:', err);
            setError(err.message || 'Error al crear el horario');
            return false;
        } finally {
            setCreating(false);
        }
    };

    // Actualizar horario
    const updateSchedule = async (id: number, data: UpdateScheduleRequest): Promise<boolean> => {
        try {
            setUpdating(true);
            setError(null);

            const updatedSchedule = await ScheduleService.updateSchedule(id, data);
            setSchedules(prev => prev.map(s => s.id === id ? updatedSchedule : s));
            
            console.log('✅ Horario actualizado exitosamente:', updatedSchedule);
            return true;
        } catch (err: any) {
            console.error('Error al actualizar horario:', err);
            setError(err.message || 'Error al actualizar el horario');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    // Obtener horario por ID
    const getScheduleById = async (id: number): Promise<Schedule | null> => {
        try {
            setError(null);
            return await ScheduleService.getScheduleById(id);
        } catch (err: any) {
            console.error('Error al obtener horario:', err);
            setError(err.message || 'Error al obtener el horario');
            return null;
        }
    };

    // Obtener horarios por estacionamiento
    const getSchedulesByParking = (parkingId: number): Schedule[] => {
        return schedules.filter(schedule => schedule.parkingId === parkingId);
    };

    // Limpiar error
    const clearError = () => {
        setError(null);
    };

    return {
        // Estado
        schedules,
        loading,
        creating,
        updating,
        error,

        // Métodos
        loadAllSchedules,
        createSchedule,
        updateSchedule,
        getScheduleById,
        
        // Utilidades
        clearError,
        getSchedulesByParking
    };
};

export default useSchedule;