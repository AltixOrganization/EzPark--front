// src/app/schedule/hooks/useSchedule.ts

import { useState, useCallback } from 'react';
import { ScheduleService } from '../services/scheduleService';
import type { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ScheduleFormData } from '../types/schedule.types';

export const useSchedule = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los horarios
    const loadAllSchedules = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ScheduleService.getAllSchedules();
            setSchedules(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar horarios');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar horarios por parking
    const loadSchedulesByParking = useCallback(async (parkingId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ScheduleService.getSchedulesByParking(parkingId);
            setSchedules(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar horarios del estacionamiento');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar solo horarios disponibles
    const loadAvailableSchedules = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ScheduleService.getAvailableSchedules();
            setSchedules(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar horarios disponibles');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar horarios disponibles para un parking específico
    const loadAvailableSchedulesByParking = useCallback(async (parkingId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ScheduleService.getAvailableSchedulesByParking(parkingId);
            setSchedules(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar horarios disponibles del estacionamiento');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar horarios por fecha
    const loadSchedulesByDate = useCallback(async (date: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ScheduleService.getSchedulesByDate(date);
            setSchedules(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar horarios por fecha');
        } finally {
            setLoading(false);
        }
    }, []);

    // Crear nuevo horario
    const createSchedule = useCallback(async (scheduleData: ScheduleFormData) => {
        try {
            setLoading(true);
            setError(null);

            // Validaciones básicas
            if (!scheduleData.day || !scheduleData.startTime || !scheduleData.endTime) {
                throw new Error('Todos los campos son requeridos');
            }

            if (scheduleData.startTime >= scheduleData.endTime) {
                throw new Error('La hora de inicio debe ser anterior a la hora de fin');
            }

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

            // Formatear los tiempos antes de usar en validaciones
            const formattedStartTime = formatTime(scheduleData.startTime);
            const formattedEndTime = formatTime(scheduleData.endTime);

            // Verificar conflictos con tiempos formateados
            const conflictCheck = await ScheduleService.checkScheduleConflicts(
                scheduleData.parkingId,
                scheduleData.day,
                formattedStartTime,
                formattedEndTime
            );

            if (conflictCheck.hasConflict) {
                throw new Error(
                    `Ya existe un horario que se superpone en este período: ${conflictCheck.conflictingSchedules.map(s => `${s.startTime}-${s.endTime}`).join(', ')}`
                );
            }

            const createData: CreateScheduleRequest = {
                parkingId: scheduleData.parkingId,
                day: scheduleData.day,
                startTime: formattedStartTime,  // ✅ Usar tiempo formateado
                endTime: formattedEndTime       // ✅ Usar tiempo formateado
            };

            console.log('📅 Data being sent to service:', createData);
            
            const newSchedule = await ScheduleService.createSchedule(createData);
            setSchedules(prev => [...prev, newSchedule]);
            return newSchedule;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear horario';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Actualizar horario existente
        const updateSchedule = useCallback(async (id: number, scheduleData: Partial<ScheduleFormData>) => {
        try {
            setLoading(true);
            setError(null);

            // Función para formatear tiempo a HH:MM:SS (reutilizar la misma lógica)
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

            // Formatear los tiempos antes de crear updateData
            const formattedStartTime = scheduleData.startTime ? formatTime(scheduleData.startTime) : '';
            const formattedEndTime = scheduleData.endTime ? formatTime(scheduleData.endTime) : '';

            const updateData: UpdateScheduleRequest = {
                day: scheduleData.day!,
                startTime: formattedStartTime,  // ✅ Usar tiempo formateado
                endTime: formattedEndTime       // ✅ Usar tiempo formateado
            };

            // Validaciones básicas
            if (updateData.startTime >= updateData.endTime) {
                throw new Error('La hora de inicio debe ser anterior a la hora de fin');
            }

            // Verificar conflictos (excluyendo el horario actual)
            if (scheduleData.parkingId) {
                const conflictCheck = await ScheduleService.checkScheduleConflicts(
                    scheduleData.parkingId,
                    updateData.day,
                    updateData.startTime,
                    updateData.endTime,
                    id // Excluir el horario actual
                );

                if (conflictCheck.hasConflict) {
                    throw new Error(
                        `Ya existe un horario que se superpone en este período: ${conflictCheck.conflictingSchedules.map(s => `${s.startTime}-${s.endTime}`).join(', ')}`
                    );
                }
            }

            console.log('🔄 Data being sent to update service:', updateData);
            
            const updatedSchedule = await ScheduleService.updateSchedule(id, updateData);
            setSchedules(prev => prev.map(s => s.id === id ? updatedSchedule : s));
            return updatedSchedule;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar horario';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Eliminar horario
    const deleteSchedule = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await ScheduleService.deleteSchedule(id);
            setSchedules(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar horario';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Verificar disponibilidad de un horario
    const checkScheduleAvailability = useCallback(async (scheduleId: number) => {
        try {
            return await ScheduleService.isScheduleAvailable(scheduleId);
        } catch (error) {
            console.error('Error checking schedule availability:', error);
            return false;
        }
    }, []);

    // Obtener horarios agrupados por día
    const getSchedulesByDay = useCallback(() => {
        const grouped = schedules.reduce((acc, schedule) => {
            const date = schedule.day;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(schedule);
            return acc;
        }, {} as Record<string, Schedule[]>);

        return Object.entries(grouped)
            .map(([date, schedules]) => ({
                date,
                schedules: schedules.sort((a, b) => a.startTime.localeCompare(b.startTime))
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [schedules]);

    return {
        // State
        schedules,
        loading,
        error,

        // Load functions
        loadAllSchedules,
        loadSchedulesByParking,
        loadAvailableSchedules,
        loadAvailableSchedulesByParking,
        loadSchedulesByDate,

        // CRUD operations
        createSchedule,
        updateSchedule,
        deleteSchedule,

        // Utility functions
        checkScheduleAvailability,
        getSchedulesByDay
    };
};

export default useSchedule;
