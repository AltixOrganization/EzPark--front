// src/app/reservation/hooks/useReservation.ts

import { useState, useCallback } from 'react';
import ReservationService from '../services/reservationService';
import { useAuth } from '../../shared/hooks/useAuth';
import type { Reservation, CreateReservationRequest, ReservationFormData } from '../types/reservation.types';
import type { Parking } from '../../parking/types/parking.types';

export const useReservation = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Cargar mis reservaciones (como guest)
    const loadMyReservations = useCallback(async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await ReservationService.getReservationsByGuest(user.id);
            setReservations(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar mis reservaciones');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Cargar solicitudes de reserva (como host)
    const loadHostReservations = useCallback(async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await ReservationService.getReservationsByHost(user.id);
            setReservations(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar solicitudes de reserva');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Crear reservación
    const createReservation = useCallback(async (formData: ReservationFormData, parking: Parking) => {
        if (!user?.id) throw new Error('Usuario no autenticado');

        try {
            setLoading(true);
            setError(null);
            
            // Calcular horas y precio total
            const startDate = new Date(`${formData.reservationDate}T${formData.startTime}`);
            const endDate = new Date(`${formData.reservationDate}T${formData.endTime}`);
            const hoursRegistered = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
            const totalFare = hoursRegistered * parking.price;

            const reservationData: CreateReservationRequest = {
                hoursRegistered,
                totalFare,
                reservationDate: formData.reservationDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                guestId: user.id,
                hostId: parking.profileId,
                parkingId: parking.id!,
                vehicleId: formData.vehicleId,
                scheduleId: formData.scheduleId
            };

            console.log('📝 Creating reservation:', reservationData);
            const newReservation = await ReservationService.createReservation(reservationData);
            
            setReservations(prev => [...prev, newReservation]);
            return newReservation;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear reservación';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Actualizar estado de reservación
    const updateReservationStatus = useCallback(async (reservationId: number, status: string) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 Updating reservation ${reservationId} status to: ${status}`);
            const updatedReservation = await ReservationService.updateReservationStatus(reservationId, status);
            
            setReservations(prev => 
                prev.map(r => r.id === reservationId ? updatedReservation : r)
            );
            return updatedReservation;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar estado de reservación';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        // State
        reservations,
        loading,
        error,
        
        // Load functions
        loadMyReservations,
        loadHostReservations,
        
        // Actions
        createReservation,
        updateReservationStatus
    };
};

export default useReservation;