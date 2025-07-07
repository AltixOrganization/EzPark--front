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
import { ProfileService } from '../../profile/services/profileService';

export class VehicleService {
    private static readonly VEHICLE_BASE_PATH = '/api/vehicles-management/vehicles';
    private static readonly BRAND_BASE_PATH = '/api/vehicles-management/brands';
    private static readonly MODEL_BASE_PATH = '/api/vehicles-management/models';

    // Vehicle endpoints
    static async getAllVehicles(): Promise<Vehicle[]> {
        return await apiService.get<Vehicle[]>(this.VEHICLE_BASE_PATH);
    }

    static async getVehicleById(id: number): Promise<Vehicle> {
        return await apiService.get<Vehicle>(`${this.VEHICLE_BASE_PATH}/${id}`);
    }

    static async getVehiclesByUser(userId: number): Promise<Vehicle[]> {
        try {
            // Obtener todos los perfiles y buscar el que corresponde al userId
            const profiles = await apiService.get<any[]>('/api/profiles');
            const userProfile = profiles.find(profile => profile.userId === userId);
            
            if (!userProfile) {
                console.warn(`No se encontró perfil para el usuario ${userId}`);
                return [];
            }
            
            console.log(`📤 Obteniendo vehículos para profileId: ${userProfile.id} (userId: ${userId})`);
            
            // Usar el profileId correcto
            return await apiService.get<Vehicle[]>(`${this.VEHICLE_BASE_PATH}/profile/${userProfile.id}`);
        } catch (error: any) {
            console.error('❌ Error al obtener vehículos del usuario:', error);
            throw error;
        }
    }

    /**
     * Método optimizado para obtener vehículos del usuario actual
     * Usa ProfileService para obtener el perfil y luego los vehículos
     */
    static async getVehiclesForCurrentUser(): Promise<Vehicle[]> {
        try {
            const profile = await ProfileService.getCurrentUserProfile();
            
            if (!profile) {
                console.warn('Usuario no tiene perfil creado');
                return [];
            }
            
            console.log(`📤 Obteniendo vehículos para profileId: ${profile.id}`);
            return await apiService.get<Vehicle[]>(`${this.VEHICLE_BASE_PATH}/profile/${profile.id}`);
        } catch (error: any) {
            console.error('❌ Error al obtener vehículos del usuario actual:', error);
            throw error;
        }
    }

    static async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
        return await apiService.post<Vehicle>(`${this.VEHICLE_BASE_PATH}`, data);
    }

    static async updateVehicle(id: number, data: UpdateVehicleRequest): Promise<Vehicle> {
        return await apiService.put<Vehicle>(`${this.VEHICLE_BASE_PATH}/${id}`, data);
    }

    static async deleteVehicle(id: number): Promise<void> {
        try {
            console.log(`📤 Eliminando vehículo con ID: ${id}`);

            await apiService.delete<void>(`${this.VEHICLE_BASE_PATH}/${id}`);

            console.log('✅ Vehículo eliminado exitosamente');

        } catch (error: any) {
            console.error('❌ Error al eliminar vehículo:', error);

            if (error.message.includes('404')) {
                throw new Error('Vehículo no encontrado');
            }

            throw new Error(error.message || 'Error al eliminar el vehículo');
        }
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
