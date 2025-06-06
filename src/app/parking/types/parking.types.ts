// src/app/parking/types/parking.types.ts

export interface Location {
    id?: number;
    address: string;
    numDirection: string;
    street: string;
    district: string;
    city: string;
    latitude: number;
    longitude: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Schedule {
    id?: number;
    parkingId?: number;
    day: string; // Formato YYYY-MM-DD
    startTime: string; // Formato HH:mm
    endTime: string; // Formato HH:mm
    isAvailable: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Parking {
    id?: number;
    profileId: number;
    width: number;
    length: number;
    height: number;
    price: number;
    phone: string;
    space: number;
    description: string;
    location: Location;
    schedules: Schedule[];
    createdAt?: string;
    updatedAt?: string;
}

// Request types para crear estacionamiento
export interface CreateLocationRequest {
    address: string;
    numDirection: string;
    street: string;
    district: string;
    city: string;
    latitude: number;
    longitude: number;
}

export interface CreateParkingRequest {
    profileId: number;
    width: number;
    length: number;
    height: number;
    price: number;
    phone: string;
    space: number;
    description: string;
    location: CreateLocationRequest;
}

export interface UpdateParkingRequest {
    width: number;
    length: number;
    height: number;
    price: number;
    phone: string;
    space: number;
    description: string;
    location: CreateLocationRequest;
}

// Request type para crear horario
export interface CreateScheduleRequest {
    parkingId: number;
    day: string;
    startTime: string;
    endTime: string;
}

// Response types
export interface ParkingListResponse {
    content: Parking[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// Form data types para el frontend
export interface ParkingFormData {
    // Información básica del estacionamiento
    width: string;
    length: string;
    height: string;
    price: string;
    phone: string;
    space: string;
    description: string;
    
    // Información de ubicación
    address: string;
    numDirection: string;
    street: string;
    district: string;
    city: string;
    latitude: number;
    longitude: number;
}

// Validation types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ParkingValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

// Map types para Google Maps
export interface MapLocation {
    lat: number;
    lng: number;
}

export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

// Filter types para búsqueda
export interface ParkingFilters {
    minPrice?: number;
    maxPrice?: number;
    location?: MapLocation;
    radius?: number; // en kilómetros
    minSpace?: number;
    maxHeight?: number;
    available?: boolean;
}