// src/app/reservation/hooks/useReservation.ts

import { useState, useCallback } from 'react';
import ReservationService from '../services/reservationService';
import { useAuth } from '../../shared/hooks/useAuth';
import { ProfileService } from '../../profile/services/profileService';
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
            const data = await ReservationService.getReservationsByUserAsGuest(user.id);
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
            const data = await ReservationService.getReservationsByUserAsHost(user.id);
            setReservations(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar solicitudes de reserva');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Crear múltiples reservaciones
    const createReservation = useCallback(async (formData: ReservationFormData, parking: Parking) => {
        if (!user?.id) throw new Error('Usuario no autenticado');

        try {
            setLoading(true);
            setError(null);
            
            // Primero obtener el profileId correcto del usuario actual
            const profile = await ProfileService.getCurrentUserProfile();
            if (!profile) {
                throw new Error('No se pudo obtener el perfil del usuario');
            }
            
            console.log('📝 Creating multiple reservations for schedules:', formData.scheduleIds);
            console.log(`👤 Using guestId (profileId): ${profile.id} for userId: ${user.id}`);
            
            const createdReservations: Reservation[] = [];
            let failedReservations = 0;
            
            // Crear una reservación por cada horario seleccionado
            for (const schedule of formData.selectedSchedules) {
                try {
                    // Calcular horas y precio para este horario específico
                    const startDate = new Date(`${schedule.day}T${schedule.startTime}`);
                    const endDate = new Date(`${schedule.day}T${schedule.endTime}`);
                    const hoursRegistered = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
                    const totalFare = hoursRegistered * parking.price;

                    const reservationData: CreateReservationRequest = {
                        hoursRegistered,
                        totalFare,
                        reservationDate: schedule.day,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                        guestId: profile.id, // Usar profileId en lugar de userId
                        hostId: parking.profileId,
                        parkingId: parking.id!,
                        vehicleId: formData.vehicleId,
                        scheduleId: schedule.id
                    };

                    console.log(`📝 Creating reservation for schedule ${schedule.id}:`, reservationData);
                    const newReservation = await ReservationService.createReservation(reservationData);
                    createdReservations.push(newReservation);
                    console.log(`✅ Reservation created for ${schedule.startTime}-${schedule.endTime}`);
                } catch (error) {
                    console.error(`❌ Error creating reservation for schedule ${schedule.id}:`, error);
                    failedReservations++;
                }
            }
            
            // Actualizar estado con las reservaciones creadas exitosamente
            if (createdReservations.length > 0) {
                setReservations(prev => [...prev, ...createdReservations]);
            }
            
            // Mostrar resumen
            const totalSchedules = formData.selectedSchedules.length;
            const successfulReservations = createdReservations.length;
            
            console.log(`✅ Resumen: ${successfulReservations}/${totalSchedules} reservaciones creadas exitosamente`);
            
            if (failedReservations > 0) {
                const errorMessage = `Se crearon ${successfulReservations} reservaciones, pero ${failedReservations} fallaron.`;
                setError(errorMessage);
                throw new Error(errorMessage);
            }
            
            return createdReservations; // Retornar array de reservaciones creadas
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear reservaciones';
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