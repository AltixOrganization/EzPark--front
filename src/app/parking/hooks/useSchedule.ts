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
    deleting: boolean;
    error: string | null;

    // Métodos
    loadAllSchedules: () => Promise<void>;
    createSchedule: (data: CreateScheduleRequest) => Promise<boolean>;
    updateSchedule: (id: number, data: UpdateScheduleRequest) => Promise<boolean>;
    deleteSchedule: (id: number) => Promise<boolean>;
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
    const [deleting, setDeleting] = useState(false);
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

    // Crear nuevo horario (ahora genera horarios por hora)
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

            // Función para generar horarios por hora
            const generateHourlySchedules = (startTime: string, endTime: string, day: string, parkingId: number): CreateScheduleRequest[] => {
                const schedules: CreateScheduleRequest[] = [];
                
                // Convertir tiempos a Date objects para facilitar cálculos
                const startDate = new Date(`2000-01-01T${startTime}`);
                const endDate = new Date(`2000-01-01T${endTime}`);
                
                // Validar que la hora de inicio sea menor que la de fin
                if (startDate >= endDate) {
                    throw new Error('La hora de inicio debe ser anterior a la hora de fin');
                }
                
                let currentTime = new Date(startDate);
                
                // Generar horarios de 1 hora cada uno
                while (currentTime < endDate) {
                    const nextHour = new Date(currentTime);
                    nextHour.setHours(nextHour.getHours() + 1);
                    
                    // Si la siguiente hora excede el tiempo final, usar el tiempo final
                    if (nextHour > endDate) {
                        nextHour.setTime(endDate.getTime());
                    }
                    
                    const scheduleStartTime = currentTime.toTimeString().slice(0, 5); // HH:MM
                    const scheduleEndTime = nextHour.toTimeString().slice(0, 5); // HH:MM
                    
                    schedules.push({
                        parkingId,
                        day,
                        startTime: formatTime(scheduleStartTime),
                        endTime: formatTime(scheduleEndTime)
                    });
                    
                    currentTime = new Date(nextHour);
                }
                
                return schedules;
            };

            console.log('📅 Generating hourly schedules from:', data);
            
            // Generar todos los horarios por hora
            const hourlySchedules = generateHourlySchedules(
                data.startTime, 
                data.endTime, 
                data.day, 
                data.parkingId
            );
            
            console.log('📅 Generated schedules:', hourlySchedules);
            
            // Crear todos los horarios en el backend
            const createdSchedules: Schedule[] = [];
            let failedSchedules = 0;
            
            for (const scheduleData of hourlySchedules) {
                try {
                    const newSchedule = await ScheduleService.createSchedule(scheduleData);
                    createdSchedules.push(newSchedule);
                    console.log('✅ Horario creado:', `${scheduleData.startTime}-${scheduleData.endTime}`);
                } catch (error) {
                    console.error('❌ Error al crear horario:', scheduleData, error);
                    failedSchedules++;
                }
            }
            
            // Actualizar el estado con los horarios creados exitosamente
            if (createdSchedules.length > 0) {
                setSchedules(prev => [...prev, ...createdSchedules]);
            }
            
            // Mostrar resumen
            const totalSchedules = hourlySchedules.length;
            const successfulSchedules = createdSchedules.length;
            
            console.log(`✅ Resumen: ${successfulSchedules}/${totalSchedules} horarios creados exitosamente`);
            
            if (failedSchedules > 0) {
                setError(`Se crearon ${successfulSchedules} horarios, pero ${failedSchedules} fallaron. Algunos horarios pueden ya existir.`);
            }
            
            return successfulSchedules > 0; // Retorna true si al menos uno fue creado
            
        } catch (err: any) {
            console.error('Error al crear horarios:', err);
            setError(err.message || 'Error al crear los horarios');
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
            const formattedData: UpdateScheduleRequest = {
                ...data,
                startTime: formatTime(data.startTime),
                endTime: formatTime(data.endTime)
            };

            console.log('🔄 Update data being sent to service:', formattedData);

            const updatedSchedule = await ScheduleService.updateSchedule(id, formattedData);
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

    // Eliminar horario
    const deleteSchedule = async (id: number): Promise<boolean> => {
        try {
            setDeleting(true);
            setError(null);

            console.log('🗑️ Eliminando horario con ID:', id);
            await ScheduleService.deleteSchedule(id);
            
            // Remover el horario del estado local
            setSchedules(prev => prev.filter(schedule => schedule.id !== id));
            
            console.log('✅ Horario eliminado exitosamente');
            return true;
        } catch (err: any) {
            console.error('Error al eliminar horario:', err);
            setError(err.message || 'Error al eliminar el horario');
            return false;
        } finally {
            setDeleting(false);
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
        deleting,
        error,

        // Métodos
        loadAllSchedules,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        getScheduleById,
        
        // Utilidades
        clearError,
        getSchedulesByParking
    };
};

export default useSchedule;