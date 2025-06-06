// src/app/parking/types/schedule.types.ts

export interface Schedule {
    id?: number;
    parkingId: number;
    day: string; // Formato YYYY-MM-DD
    startTime: string; // Formato HH:mm
    endTime: string; // Formato HH:mm
    isAvailable: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateScheduleRequest {
    parkingId: number;
    day: string;
    startTime: string;
    endTime: string;
}

export interface UpdateScheduleRequest {
    day: string;
    startTime: string;
    endTime: string;
}

export interface ScheduleFormData {
    day: string;
    startTime: string;
    endTime: string;
}