// src/app/schedule/services/scheduleService.ts

import { apiService } from '../../shared/utils/api';
import type { Schedule, CreateScheduleRequest, UpdateScheduleRequest } from '../types/schedule.types';

export class ScheduleService {
    private static readonly BASE_PATH = '/api/parking-management/schedule';

    /**
     * Obtener todos los horarios
     */
    static async getAllSchedules(): Promise<Schedule[]> {
        return await apiService.get<Schedule[]>(this.BASE_PATH);
    }

    /**
     * Obtener horario por ID
     */
    static async getScheduleById(id: number): Promise<Schedule> {
        return await apiService.get<Schedule>(`${this.BASE_PATH}/${id}`);
    }

    /**
     * Obtener horarios por parking ID
     */
    static async getSchedulesByParking(parkingId: number): Promise<Schedule[]> {
        // Asumiendo que el backend puede filtrar por parkingId
        const allSchedules = await this.getAllSchedules();
        return allSchedules.filter(schedule => schedule.parkingId === parkingId);
    }

    /**
     * Obtener solo horarios disponibles
     */
    static async getAvailableSchedules(): Promise<Schedule[]> {
        const allSchedules = await this.getAllSchedules();
        return allSchedules.filter(schedule => schedule.isAvailable);
    }

    /**
     * Obtener horarios disponibles para un parking específico
     */
    static async getAvailableSchedulesByParking(parkingId: number): Promise<Schedule[]> {
        const parkingSchedules = await this.getSchedulesByParking(parkingId);
        return parkingSchedules.filter(schedule => schedule.isAvailable);
    }

    /**
     * Obtener horarios para una fecha específica
     */
    static async getSchedulesByDate(date: string): Promise<Schedule[]> {
        const allSchedules = await this.getAllSchedules();
        return allSchedules.filter(schedule => schedule.day === date);
    }

    /**
     * Obtener horarios disponibles para un parking en una fecha específica
     */
    static async getAvailableSchedulesByParkingAndDate(parkingId: number, date: string): Promise<Schedule[]> {
        const parkingSchedules = await this.getSchedulesByParking(parkingId);
        return parkingSchedules.filter(schedule => 
            schedule.day === date && schedule.isAvailable
        );
    }

    /**
     * Crear nuevo horario
     */
    static async createSchedule(data: CreateScheduleRequest): Promise<Schedule> {
        console.log('📅 Creating schedule with pre-formatted data:', data);
        return await apiService.post<Schedule>(this.BASE_PATH, data);
    }

    /**
     * Actualizar horario existente
     */
    static async updateSchedule(id: number, data: UpdateScheduleRequest): Promise<Schedule> {
        console.log(`🔄 Updating schedule ${id}:`, data);
        return await apiService.put<Schedule>(`${this.BASE_PATH}/${id}`, data);
    }

    /**
     * Eliminar horario
     */
    static async deleteSchedule(id: number): Promise<void> {
        console.log(`🗑️ Deleting schedule ${id}`);
        return await apiService.delete<void>(`${this.BASE_PATH}/delete/${id}`);
    }

    /**
     * Verificar si un horario está disponible
     */
    static async isScheduleAvailable(scheduleId: number): Promise<boolean> {
        try {
            const schedule = await this.getScheduleById(scheduleId);
            return schedule.isAvailable;
        } catch (error) {
            console.error('Error checking schedule availability:', error);
            return false;
        }
    }

    /**
     * Validar si hay conflictos de horarios para un parking
     */
    static async checkScheduleConflicts(
        parkingId: number, 
        day: string, 
        startTime: string, 
        endTime: string,
        excludeScheduleId?: number
    ): Promise<{hasConflict: boolean, conflictingSchedules: Schedule[]}> {
        const parkingSchedules = await this.getSchedulesByParking(parkingId);
        
        const conflictingSchedules = parkingSchedules.filter(schedule => {
            // Excluir el horario que estamos editando
            if (excludeScheduleId && schedule.id === excludeScheduleId) {
                return false;
            }

            // Solo verificar el mismo día
            if (schedule.day !== day) {
                return false;
            }

            // Verificar overlap de horarios
            const existingStart = schedule.startTime;
            const existingEnd = schedule.endTime;

            // Hay conflicto si hay overlap
            return (
                (startTime >= existingStart && startTime < existingEnd) ||
                (endTime > existingStart && endTime <= existingEnd) ||
                (startTime <= existingStart && endTime >= existingEnd)
            );
        });

        return {
            hasConflict: conflictingSchedules.length > 0,
            conflictingSchedules
        };
    }
}

export default ScheduleService;
