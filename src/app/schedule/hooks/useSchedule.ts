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

            // Verificar conflictos
            const conflictCheck = await ScheduleService.checkScheduleConflicts(
                scheduleData.parkingId,
                scheduleData.day,
                scheduleData.startTime,
                scheduleData.endTime
            );

            if (conflictCheck.hasConflict) {
                throw new Error(
                    `Ya existe un horario que se superpone en este período: ${conflictCheck.conflictingSchedules.map(s => `${s.startTime}-${s.endTime}`).join(', ')}`
                );
            }

            const createData: CreateScheduleRequest = {
                parkingId: scheduleData.parkingId,
                day: scheduleData.day,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime
            };

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

            const updateData: UpdateScheduleRequest = {
                day: scheduleData.day!,
                startTime: scheduleData.startTime!,
                endTime: scheduleData.endTime!
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
