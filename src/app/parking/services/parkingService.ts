// src/app/parking/services/parkingService.ts

import { apiService } from '../../shared/utils/api';
import type {
    Parking,
    CreateParkingRequest,
    UpdateParkingRequest,
    CreateScheduleRequest,
    Schedule,
    MapLocation
} from '../types/parking.types';

const API_BASE_URL = 'http://localhost:8080'; // Agregamos esta constante

export class ParkingService {    private static readonly PARKING_BASE_PATH = '/api/parking-management/parking';
    private static readonly SCHEDULE_BASE_PATH = '/api/parking-management/schedule';

    // ===============================
    // MÉTODOS PARA ESTACIONAMIENTOS
    // ===============================

    /**
     * Obtener todos los estacionamientos
     */
    static async getAllParkings(): Promise<Parking[]> {
        try {
            console.log('📤 Obteniendo todos los estacionamientos');

            const response = await apiService.get<Parking[]>(this.PARKING_BASE_PATH);

            console.log('✅ Estacionamientos obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener estacionamientos:', error);
            throw new Error(error.message || 'Error al obtener los estacionamientos');
        }
    }

    /**
     * Crear un nuevo estacionamiento
     */
    static async createParking(parkingData: CreateParkingRequest): Promise<Parking> {
        try {
            console.log('📤 Creando estacionamiento:', parkingData);

            // Validar datos antes de enviar
            this.validateParkingData(parkingData);

            const response = await apiService.post<Parking>(this.PARKING_BASE_PATH, parkingData);

            console.log('✅ Estacionamiento creado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al crear estacionamiento:', error);

            if (error.message.includes('400')) {
                throw new Error('Datos del estacionamiento inválidos. Verifica todos los campos.');
            }
            if (error.message.includes('404') && error.message.includes('Profile not found')) {
                throw new Error('Perfil de usuario no encontrado');
            }

            throw new Error(error.message || 'Error al crear el estacionamiento');
        }
    }

    /**
     * Obtener estacionamiento por ID
     */
    static async getParkingById(parkingId: number): Promise<Parking> {
        try {
            console.log(`📤 Obteniendo estacionamiento con ID: ${parkingId}`);

            const response = await apiService.get<Parking>(`${this.PARKING_BASE_PATH}/${parkingId}/details`);

            console.log('✅ Estacionamiento obtenido:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener estacionamiento:', error);

            if (error.message.includes('404')) {
                throw new Error('Estacionamiento no encontrado');
            }

            throw new Error(error.message || 'Error al obtener el estacionamiento');
        }
    }

    /**
     * Obtener estacionamientos por perfil de usuario
     */
    static async getParkingsByProfile(profileId: number): Promise<Parking[]> {
        try {
            console.log(`📤 Obteniendo estacionamientos del perfil: ${profileId}`);

            const response = await apiService.get<Parking[]>(`${this.PARKING_BASE_PATH}/profile/${profileId}`);

            console.log('✅ Estacionamientos del usuario obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener estacionamientos del usuario:', error);
            throw new Error(error.message || 'Error al obtener tus estacionamientos');
        }
    }

    /**
     * Obtener estacionamientos cercanos a una ubicación
     */
    static async getNearbyParkings(location: MapLocation): Promise<Parking[]> {
        try {
            console.log(`📤 Obteniendo estacionamientos cercanos a:`, location);

            const response = await apiService.get<Parking[]>(
                `${this.PARKING_BASE_PATH}/nearby?lat=${location.lat}&lng=${location.lng}`
            );

            console.log('✅ Estacionamientos cercanos obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener estacionamientos cercanos:', error);
            throw new Error(error.message || 'Error al buscar estacionamientos cercanos');
        }
    }

    /**
     * Actualizar estacionamiento
     */
    static async updateParking(parkingId: number, parkingData: UpdateParkingRequest): Promise<Parking> {
        try {
            console.log(`📤 Actualizando estacionamiento ${parkingId}:`, parkingData);

            const response = await apiService.put<Parking>(`${this.PARKING_BASE_PATH}/${parkingId}`, parkingData);

            console.log('✅ Estacionamiento actualizado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al actualizar estacionamiento:', error);

            if (error.message.includes('404')) {
                throw new Error('Estacionamiento no encontrado');
            }
            if (error.message.includes('400')) {
                throw new Error('Datos del estacionamiento inválidos');
            }

            throw new Error(error.message || 'Error al actualizar el estacionamiento');
        }
    }

    /**
     * Eliminar estacionamiento
     */
    static async deleteParking(parkingId: number): Promise<void> {
        try {
            console.log(`📤 Eliminando estacionamiento con ID: ${parkingId}`);

            // Usar fetch directamente para manejar la respuesta de texto
            const token = localStorage.getItem('ezpark_token');
            const url = `${API_BASE_URL}${this.PARKING_BASE_PATH}/delete/${parkingId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            console.log(`📡 Response from delete ${parkingId}:`, {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;

                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (parseError) {
                    // Si no es JSON, usar el statusText
                    errorMessage = response.statusText || 'Error al eliminar estacionamiento';
                }

                throw new Error(errorMessage);
            }

            // El backend devuelve texto plano, no JSON, así que solo verificamos que sea exitoso
            const responseText = await response.text();
            console.log('✅ Estacionamiento eliminado exitosamente:', responseText);

        } catch (error: any) {
            console.error('❌ Error al eliminar estacionamiento:', error);

            if (error.message.includes('404')) {
                throw new Error('Estacionamiento no encontrado');
            }

            throw new Error(error.message || 'Error al eliminar el estacionamiento');
        }
    }

    /**
     * Obtener detalles completos de un parking por ID
     */
    static async getParkingDetails(id: number): Promise<Parking> {
        try {
            console.log(`📤 Obteniendo detalles del parking con ID: ${id}`);

            const response = await apiService.get<Parking>(`${this.PARKING_BASE_PATH}/${id}/details`);

            console.log('✅ Detalles del parking obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener detalles del parking:', error);

            if (error.message.includes('404')) {
                throw new Error('Parking no encontrado');
            }

            throw new Error(error.message || 'Error al obtener los detalles del parking');
        }
    }

    // ===============================
    // MÉTODOS PARA HORARIOS
    // ===============================

    /**
     * Crear horario para un estacionamiento
     */
    static async createSchedule(scheduleData: CreateScheduleRequest): Promise<Schedule> {
        try {
            console.log('📤 Creando horario:', scheduleData);

            const response = await apiService.post<Schedule>(this.SCHEDULE_BASE_PATH, scheduleData);

            console.log('✅ Horario creado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al crear horario:', error);
            throw new Error(error.message || 'Error al crear el horario');
        }
    }

    /**
     * Obtener todos los horarios
     */
    static async getAllSchedules(): Promise<Schedule[]> {
        try {
            console.log('📤 Obteniendo todos los horarios');

            const response = await apiService.get<Schedule[]>(this.SCHEDULE_BASE_PATH);

            console.log('✅ Horarios obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener horarios:', error);
            throw new Error(error.message || 'Error al obtener los horarios');
        }
    }

    /**
     * Obtener horario por ID
     */
    static async getScheduleById(scheduleId: number): Promise<Schedule> {
        try {
            console.log(`📤 Obteniendo horario con ID: ${scheduleId}`);

            const response = await apiService.get<Schedule>(`${this.SCHEDULE_BASE_PATH}/${scheduleId}`);

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

    // ===============================
    // MÉTODOS DE VALIDACIÓN
    // ===============================

    /**
     * Validar datos del estacionamiento antes de enviar
     */
    private static validateParkingData(data: CreateParkingRequest): void {
        const errors: string[] = [];

        // Validar dimensiones
        if (!data.width || data.width <= 0) {
            errors.push('El ancho debe ser mayor a 0');
        }
        if (!data.length || data.length <= 0) {
            errors.push('El largo debe ser mayor a 0');
        }
        if (!data.height || data.height <= 0) {
            errors.push('La altura debe ser mayor a 0');
        }

        // Validar precio
        if (!data.price || data.price <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        // Validar teléfono
        const phoneRegex = /^\+?[0-9]{9,15}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            errors.push('El teléfono debe tener entre 9 y 15 dígitos');
        }

        // Validar espacios
        if (!data.space || data.space <= 0) {
            errors.push('El número de espacios debe ser mayor a 0');
        }

        // Validar descripción
        if (!data.description || data.description.trim().length === 0) {
            errors.push('La descripción es requerida');
        }

        // Validar ubicación
        if (!data.location) {
            errors.push('La ubicación es requerida');
        } else {
            if (!data.location.address || data.location.address.trim().length === 0) {
                errors.push('La dirección es requerida');
            }
            if (data.location.latitude < -90 || data.location.latitude > 90) {
                errors.push('La latitud debe estar entre -90 y 90');
            }
            if (data.location.longitude < -180 || data.location.longitude > 180) {
                errors.push('La longitud debe estar entre -180 y 180');
            }
        }

        if (errors.length > 0) {
            throw new Error(`Datos inválidos:\n${errors.join('\n')}`);
        }
    }

    /**
     * Obtener el perfil ID del usuario actual
     */
    static getCurrentUserProfileId(): number {
        try {
            const userStr = localStorage.getItem('ezpark_user');
            if (!userStr) {
                throw new Error('Usuario no autenticado');
            }

            const user = JSON.parse(userStr);
            return user.id; // Según tu backend, el profileId es igual al userId
        } catch (error) {
            console.error('Error al obtener perfil del usuario:', error);
            throw new Error('No se pudo obtener el perfil del usuario');
        }
    }
}

export default ParkingService;