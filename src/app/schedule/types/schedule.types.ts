// src/app/schedule/types/schedule.types.ts

export interface Schedule {
    id: number;
    parkingId: number;
    day: string; // formato: "YYYY-MM-DD"
    startTime: string; // formato: "HH:mm:ss"
    endTime: string; // formato: "HH:mm:ss"
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    parking?: {
        id: number;
        space: string;
        price: number;
        description: string;
    };
}

export interface CreateScheduleRequest {
    parkingId: number;
    day: string; // formato: "YYYY-MM-DD"
    startTime: string; // formato: "HH:mm:ss"
    endTime: string; // formato: "HH:mm:ss"
}

export interface UpdateScheduleRequest {
    day: string; // formato: "YYYY-MM-DD"
    startTime: string; // formato: "HH:mm:ss"
    endTime: string; // formato: "HH:mm:ss"
}

export interface ScheduleFormData {
    parkingId: number;
    day: string;
    startTime: string;
    endTime: string;
}

// Estados para filtros y búsquedas
export type ScheduleAvailability = 'all' | 'available' | 'unavailable';

// Para mostrar horarios por día
export interface ScheduleByDay {
    date: string;
    schedules: Schedule[];
}

// Para validación de conflictos
export interface ScheduleConflictCheck {
    hasConflict: boolean;
    conflictingSchedules?: Schedule[];
    message?: string;
}
