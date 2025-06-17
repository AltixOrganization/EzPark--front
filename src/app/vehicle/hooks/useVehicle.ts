// src/app/vehicle/hooks/useVehicle.ts

import { useState, useCallback } from 'react';
import { VehicleService } from '../services/vehicleService';
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

export const useVehicle = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Vehicle functions
    const loadAllVehicles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await VehicleService.getAllVehicles();
            setVehicles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar vehículos');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadVehiclesByUser = useCallback(async (userId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await VehicleService.getVehiclesByUser(userId);
            setVehicles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar vehículos del usuario');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVehicle = useCallback(async (vehicleData: CreateVehicleRequest) => {
        try {
            setLoading(true);
            setError(null);
            const newVehicle = await VehicleService.createVehicle(vehicleData);
            setVehicles(prev => [...prev, newVehicle]);
            return newVehicle;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear vehículo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateVehicle = useCallback(async (id: number, vehicleData: UpdateVehicleRequest) => {
        try {
            setLoading(true);
            setError(null);
            const updatedVehicle = await VehicleService.updateVehicle(id, vehicleData);
            setVehicles(prev => prev.map(vehicle => 
                vehicle.id === id ? updatedVehicle : vehicle
            ));
            return updatedVehicle;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar vehículo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteVehicle = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await VehicleService.deleteVehicle(id);
            setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar vehículo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper function to initialize default data
    const initializeDefaultData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔍 Loading brands from backend...');
            
            // Try to load brands first
            let brandsData;
            try {
                brandsData = await VehicleService.getAllBrands();
                console.log('✅ Brands loaded:', brandsData);
                setBrands(brandsData);
            } catch (err) {
                console.error('❌ Error loading brands:', err);
                if (err instanceof Error && err.message.includes('401')) {
                    setError('Error de autenticación. Por favor inicia sesión nuevamente.');
                    return;
                } else {
                    console.warn('Continuing without brands data...');
                    brandsData = [];
                    setBrands([]);
                }
            }
            
            // For now, set models to empty since backend doesn't have GET /models
            setModels([]);
            
            // If no brands exist, create some default ones
            if (brandsData.length === 0) {
                console.log('📝 No brands found, creating default brands...');
                
                const defaultBrands = [
                    { name: 'Toyota', description: 'Marca japonesa de vehículos confiables' },
                    { name: 'Honda', description: 'Vehículos japoneses de calidad' },
                    { name: 'Hyundai', description: 'Marca coreana moderna' }
                ];

                const createdBrands = [];
                for (const brandData of defaultBrands) {
                    try {
                        console.log(`Creating brand: ${brandData.name}`);
                        const brand = await VehicleService.createBrand(brandData);
                        createdBrands.push(brand);
                        console.log(`✅ Created brand: ${brand.name}`);
                    } catch (err) {
                        console.warn(`❌ Failed to create brand ${brandData.name}:`, err);
                    }
                }

                setBrands(createdBrands);
                
                // Create some models for the first brand only (for testing)
                if (createdBrands.length > 0) {
                    const firstBrand = createdBrands[0];
                    const testModels = ['Corolla', 'Camry'];
                    
                    for (const modelName of testModels) {
                        try {
                            console.log(`Creating model: ${modelName} for ${firstBrand.name}`);
                            const model = await VehicleService.createModel({
                                brandId: firstBrand.id,
                                name: modelName,
                                description: `${modelName} - ${firstBrand.name}`
                            });
                            setModels(prev => [...prev, model]);
                            console.log(`✅ Created model: ${model.name}`);
                        } catch (err) {
                            console.warn(`❌ Failed to create model ${modelName}:`, err);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('💥 Error initializing default data:', err);
            setError(err instanceof Error ? err.message : 'Error al inicializar datos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Brand functions
    const loadAllBrands = useCallback(async () => {
        return initializeDefaultData();
    }, [initializeDefaultData]);

    const createBrand = useCallback(async (brandData: CreateBrandRequest) => {
        try {
            setLoading(true);
            setError(null);
            const newBrand = await VehicleService.createBrand(brandData);
            setBrands(prev => [...prev, newBrand]);
            return newBrand;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear marca';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBrand = useCallback(async (id: number, brandData: UpdateBrandRequest) => {
        try {
            setLoading(true);
            setError(null);
            const updatedBrand = await VehicleService.updateBrand(id, brandData);
            setBrands(prev => prev.map(brand => 
                brand.id === id ? updatedBrand : brand
            ));
            return updatedBrand;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar marca';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBrand = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await VehicleService.deleteBrand(id);
            setBrands(prev => prev.filter(brand => brand.id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar marca';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Model functions
    const createModel = useCallback(async (modelData: CreateModelRequest) => {
        try {
            setLoading(true);
            setError(null);
            const newModel = await VehicleService.createModel(modelData);
            setModels(prev => [...prev, newModel]);
            return newModel;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear modelo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateModel = useCallback(async (id: number, modelData: UpdateModelRequest) => {
        try {
            setLoading(true);
            setError(null);
            const updatedModel = await VehicleService.updateModel(id, modelData);
            setModels(prev => prev.map(model => 
                model.id === id ? updatedModel : model
            ));
            return updatedModel;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar modelo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteModel = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await VehicleService.deleteModel(id);
            setModels(prev => prev.filter(model => model.id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar modelo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load models for a specific brand (since we can't get all models at once)
    const loadModelsByBrand = useCallback(async (brandId: number) => {
        // For now, return empty array since backend doesn't have a way to get models by brand
        // This would need to be implemented in your backend as GET /brands/{id}/models
        console.log(`Would load models for brand ${brandId}, but endpoint not available`);
        return [];
    }, []);

    return {
        // State
        vehicles,
        brands,
        models,
        loading,
        error,
        
        // Vehicle functions
        loadAllVehicles,
        loadVehiclesByUser,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        
        // Brand functions
        loadAllBrands,
        loadModelsByBrand,
        createBrand,
        updateBrand,
        deleteBrand,
        
        // Model functions
        createModel,
        updateModel,
        deleteModel
    };
};

export default useVehicle;
