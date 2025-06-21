// src/app/reservation/services/reservationService.ts

import { apiService } from '../../shared/utils/api';
import type { Reservation, CreateReservationRequest, UpdateReservationRequest } from '../types/reservation.types';

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