// src/app/vehicle/services/vehicleService.ts

import { apiService } from '../../shared/utils/api';
import type { 
    Vehicle, 
    CreateVehicleRequest, 
    UpdateVehicleRequest,
    Brand,
    Model,
    CreateBrandRequest,
    UpdateBrandRequest,
    CreateModelRequest,
    UpdateModelRequest
} from '../types/vehicle.types';

export class VehicleService {
    private static readonly VEHICLE_BASE_PATH = '/vehicles';
    private static readonly BRAND_BASE_PATH = '/brands';
    private static readonly MODEL_BASE_PATH = '/models';

    // Vehicle endpoints
    static async getAllVehicles(): Promise<Vehicle[]> {
        return await apiService.get<Vehicle[]>(this.VEHICLE_BASE_PATH);
    }

    static async getVehicleById(id: number): Promise<Vehicle> {
        return await apiService.get<Vehicle>(`${this.VEHICLE_BASE_PATH}/${id}`);
    }

    static async getVehiclesByUser(userId: number): Promise<Vehicle[]> {
        return await apiService.get<Vehicle[]>(`${this.VEHICLE_BASE_PATH}/user/${userId}`);
    }

    static async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
        return await apiService.post<Vehicle>(`${this.VEHICLE_BASE_PATH}/create`, data);
    }

    static async updateVehicle(id: number, data: UpdateVehicleRequest): Promise<Vehicle> {
        return await apiService.put<Vehicle>(`${this.VEHICLE_BASE_PATH}/update/${id}`, data);
    }

    static async deleteVehicle(id: number): Promise<void> {
        return await apiService.delete<void>(`${this.VEHICLE_BASE_PATH}/delete/${id}`);
    }

    // Brand endpoints
    static async getAllBrands(): Promise<Brand[]> {
        return await apiService.get<Brand[]>(this.BRAND_BASE_PATH);
    }

    static async createBrand(data: CreateBrandRequest): Promise<Brand> {
        return await apiService.post<Brand>(this.BRAND_BASE_PATH, data);
    }

    static async updateBrand(id: number, data: UpdateBrandRequest): Promise<Brand> {
        return await apiService.put<Brand>(`${this.BRAND_BASE_PATH}/${id}`, data);
    }

    static async deleteBrand(id: number): Promise<void> {
        return await apiService.delete<void>(`${this.BRAND_BASE_PATH}/${id}`);
    }

    // Model endpoints
    static async getAllModels(): Promise<Model[]> {
        // NOTE: El backend no tiene GET /models, devolvemos array vacío por ahora
        // Los modelos se cargarán cuando se carguen las marcas (si las marcas incluyen sus modelos)
        console.warn('Backend does not have GET /models endpoint, returning empty array');
        return [];
    }

    static async createModel(data: CreateModelRequest): Promise<Model> {
        return await apiService.post<Model>(this.MODEL_BASE_PATH, data);
    }

    static async updateModel(id: number, data: UpdateModelRequest): Promise<Model> {
        return await apiService.put<Model>(`${this.MODEL_BASE_PATH}/${id}`, data);
    }

    static async deleteModel(id: number): Promise<void> {
        return await apiService.delete<void>(`${this.MODEL_BASE_PATH}/${id}`);
    }
}

export default VehicleService;
