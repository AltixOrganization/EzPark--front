// src/app/vehicle/types/vehicle.types.ts

export interface Brand {
    id: number;
    name: string;
    description: string;
}

export interface Model {
    id: number;
    name: string;
    description: string;
    brandId: number;
    brand?: Brand;
}

export interface Vehicle {
    id: number;
    licensePlate: string;
    modelId: number;
    profileId: number;
    model?: Model;
}

export interface CreateVehicleRequest {
    licensePlate: string;
    modelId: number;
    profileId: number;
}

export interface UpdateVehicleRequest {
    licensePlate: string;
    modelId: number;
}

export interface CreateBrandRequest {
    name: string;
    description: string;
}

export interface UpdateBrandRequest {
    name: string;
    description: string;
}

export interface CreateModelRequest {
    brandId: number;
    name: string;
    description: string;
}

export interface UpdateModelRequest {
    brandId: number;
    name: string;
    description: string;
}
