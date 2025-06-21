// src/app/reservation/types/reservation.types.ts

export interface Reservation {
    id: number;
    hoursRegistered: number;
    totalFare: number;
    reservationDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
    status: 'Pending' | 'Approved' | 'InProgress' | 'Completed' | 'Cancelled';
    guestId: number;
    hostId: number;
    parkingId: number;
    vehicleId: number;
    scheduleId: number;
    createdAt: string;
    updatedAt: string;
    
    // Relaciones opcionales (dependiendo de lo que devuelva el backend)
    guest?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    host?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    parking?: {
        id: number;
        space: string;
        description: string;
        price: number;
        location: {
            address: string;
            district: string;
            city: string;
        };
    };
    vehicle?: {
        id: number;
        licensePlate: string;
        model: {
            name: string;
            brand: {
                name: string;
            };
        };
    };
    schedule?: {
        id: number;
        day: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    };
}

export interface CreateReservationRequest {
    hoursRegistered: number;
    totalFare: number;
    reservationDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
    guestId: number;
    hostId: number;
    parkingId: number;
    vehicleId: number;
    scheduleId: number;
}

export interface UpdateReservationRequest {
    hoursRegistered?: number;
    totalFare?: number;
    reservationDate?: string;
    startTime?: string;
    endTime?: string;
    scheduleId?: number;
}

export interface ReservationFormData {
    vehicleId: number;
    scheduleId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
}

// Estados de reservación para filtros
export type ReservationStatus = 'Pending' | 'Approved' | 'InProgress' | 'Completed' | 'Cancelled';

// Para estadísticas
export interface ReservationStats {
    total: number;
    pending: number;
    approved: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalEarnings: number;
}