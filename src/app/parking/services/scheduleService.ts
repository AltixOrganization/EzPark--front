// src/app/parking/services/scheduleService.ts

import { apiService } from '../../shared/utils/api';
import type { 
    Schedule, 
    CreateScheduleRequest, 
    UpdateScheduleRequest 
} from '../types/schedule.types';

export class ScheduleService {
    private static readonly BASE_PATH = '/api/parking-management/schedule';

    /**
     * Obtener todos los horarios
     */
    static async getAllSchedules(): Promise<Schedule[]> {
        try {
            console.log('📤 Obteniendo todos los horarios');
            const response = await apiService.get<Schedule[]>(this.BASE_PATH);
            console.log('✅ Horarios obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener horarios:', error);
            throw new Error(error.message || 'Error al obtener los horarios');
        }
    }

    /**
     * Crear nuevo horario
     */
    static async createSchedule(scheduleData: CreateScheduleRequest): Promise<Schedule> {
        try {
            console.log('📤 Creando horario:', scheduleData);
            const response = await apiService.post<Schedule>(this.BASE_PATH, scheduleData);
            console.log('✅ Horario creado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al crear horario:', error);
            
            if (error.message.includes('400')) {
                throw new Error('Datos del horario inválidos');
            }
            if (error.message.includes('404')) {
                throw new Error('Estacionamiento no encontrado');
            }
            
            throw new Error(error.message || 'Error al crear el horario');
        }
    }

    /**
     * Obtener horario por ID
     */
    static async getScheduleById(scheduleId: number): Promise<Schedule> {
        try {
            console.log(`📤 Obteniendo horario con ID: ${scheduleId}`);
            const response = await apiService.get<Schedule>(`${this.BASE_PATH}/${scheduleId}`);
            console.log('✅ Horario obtenido:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener horario:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Horario no encontrado');
            }
            
            throw new Error(error.message || 'Error al obtener el horario');
        }
    }

    /**
     * Actualizar horario
     */
    static async updateSchedule(scheduleId: number, scheduleData: UpdateScheduleRequest): Promise<Schedule> {
        try {
            console.log(`📤 Actualizando horario ${scheduleId}:`, scheduleData);
            const response = await apiService.put<Schedule>(`${this.BASE_PATH}/${scheduleId}`, scheduleData);
            console.log('✅ Horario actualizado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al actualizar horario:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Horario no encontrado');
            }
            if (error.message.includes('400')) {
                throw new Error('Datos del horario inválidos');
            }
            
            throw new Error(error.message || 'Error al actualizar el horario');
        }
    }

    /**
     * Eliminar horario
     */
    static async deleteSchedule(scheduleId: number): Promise<void> {
        try {
            console.log(`📤 Eliminando horario con ID: ${scheduleId}`);
            await apiService.delete(`${this.BASE_PATH}/${scheduleId}`);
            console.log('✅ Horario eliminado exitosamente');
        } catch (error: any) {
            console.error('❌ Error al eliminar horario:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Horario no encontrado');
            }
            
            throw new Error(error.message || 'Error al eliminar el horario');
        }
    }
}

export default ScheduleService;