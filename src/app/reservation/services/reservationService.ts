// src/app/reservation/services/reservationService.ts

import { apiService } from '../../shared/utils/api';
import type { Reservation, CreateReservationRequest, UpdateReservationRequest } from '../types/reservation.types';
import { ProfileService } from '../../profile/services/profileService';

export class ReservationService {
    private static readonly BASE_PATH = '/api/reservations';

    static async getAllReservations(): Promise<Reservation[]> {
        return await apiService.get<Reservation[]>(this.BASE_PATH);
    }

    static async getReservationById(id: number): Promise<Reservation> {
        return await apiService.get<Reservation>(`${this.BASE_PATH}/${id}`);
    }

    static async getReservationsByGuest(guestId: number): Promise<Reservation[]> {
        return await apiService.get<Reservation[]>(`${this.BASE_PATH}/guest/${guestId}`);
    }

    static async getReservationsByHost(hostId: number): Promise<Reservation[]> {
        return await apiService.get<Reservation[]>(`${this.BASE_PATH}/host/${hostId}`);
    }

    /**
     * Obtener reservaciones del usuario actual como guest
     * Convierte userId a profileId antes de llamar al endpoint
     */
    static async getReservationsByUserAsGuest(userId: number): Promise<Reservation[]> {
        try {
            // Obtener todos los perfiles y buscar el que corresponde al userId
            const profiles = await apiService.get<any[]>('/api/profiles');
            const userProfile = profiles.find(profile => profile.userId === userId);
            
            if (!userProfile) {
                console.warn(`No se encontró perfil para el usuario ${userId}`);
                return [];
            }
            
            console.log(`📤 Obteniendo reservaciones como guest para profileId: ${userProfile.id} (userId: ${userId})`);
            
            // Usar el profileId correcto
            return await apiService.get<Reservation[]>(`${this.BASE_PATH}/guest/${userProfile.id}`);
        } catch (error: any) {
            console.error('❌ Error al obtener reservaciones del usuario como guest:', error);
            throw error;
        }
    }

    /**
     * Obtener reservaciones del usuario actual como host
     * Convierte userId a profileId antes de llamar al endpoint
     */
    static async getReservationsByUserAsHost(userId: number): Promise<Reservation[]> {
        try {
            // Obtener todos los perfiles y buscar el que corresponde al userId
            const profiles = await apiService.get<any[]>('/api/profiles');
            const userProfile = profiles.find(profile => profile.userId === userId);
            
            if (!userProfile) {
                console.warn(`No se encontró perfil para el usuario ${userId}`);
                return [];
            }
            
            console.log(`📤 Obteniendo reservaciones como host para profileId: ${userProfile.id} (userId: ${userId})`);
            
            // Usar el profileId correcto
            return await apiService.get<Reservation[]>(`${this.BASE_PATH}/host/${userProfile.id}`);
        } catch (error: any) {
            console.error('❌ Error al obtener reservaciones del usuario como host:', error);
            throw error;
        }
    }

    /**
     * Método optimizado para obtener reservaciones del usuario actual como guest
     * Usa ProfileService para obtener el perfil y luego las reservaciones
     */
    static async getReservationsForCurrentUserAsGuest(): Promise<Reservation[]> {
        try {
            const profile = await ProfileService.getCurrentUserProfile();
            
            if (!profile) {
                console.warn('Usuario no tiene perfil creado');
                return [];
            }
            
            console.log(`📤 Obteniendo reservaciones como guest para profileId: ${profile.id}`);
            return await apiService.get<Reservation[]>(`${this.BASE_PATH}/guest/${profile.id}`);
        } catch (error: any) {
            console.error('❌ Error al obtener reservaciones del usuario actual como guest:', error);
            throw error;
        }
    }

    /**
     * Método optimizado para obtener reservaciones del usuario actual como host
     * Usa ProfileService para obtener el perfil y luego las reservaciones
     */
    static async getReservationsForCurrentUserAsHost(): Promise<Reservation[]> {
        try {
            const profile = await ProfileService.getCurrentUserProfile();
            
            if (!profile) {
                console.warn('Usuario no tiene perfil creado');
                return [];
            }
            
            console.log(`📤 Obteniendo reservaciones como host para profileId: ${profile.id}`);
            return await apiService.get<Reservation[]>(`${this.BASE_PATH}/host/${profile.id}`);
        } catch (error: any) {
            console.error('❌ Error al obtener reservaciones del usuario actual como host:', error);
            throw error;
        }
    }

    static async getInProgressReservations(): Promise<Reservation[]> {
        return await apiService.get<Reservation[]>(`${this.BASE_PATH}/inProgress`);
    }

    static async getUpcomingReservations(): Promise<Reservation[]> {
        return await apiService.get<Reservation[]>(`${this.BASE_PATH}/upComing`);
    }

    static async getPastReservations(): Promise<Reservation[]> {
        return await apiService.get<Reservation[]>(`${this.BASE_PATH}/past`);
    }

    static async createReservation(data: CreateReservationRequest): Promise<Reservation> {
        return await apiService.post<Reservation>(this.BASE_PATH, data);
    }

    static async updateReservation(id: number, data: UpdateReservationRequest): Promise<Reservation> {
        return await apiService.put<Reservation>(`${this.BASE_PATH}/${id}`, data);
    }

    static async updateReservationStatus(id: number, status: string): Promise<Reservation> {
        return await apiService.put<Reservation>(`${this.BASE_PATH}/${id}/status`, { status });
    }
}

export default ReservationService;