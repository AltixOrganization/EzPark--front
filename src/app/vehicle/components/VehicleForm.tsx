// src/app/vehicle/components/VehicleForm.tsx

import React, { useState, useEffect } from 'react';
import { useVehicle } from '../hooks/useVehicle';
import { useAuth } from '../../shared/hooks/useAuth';
import { ProfileService } from '../../profile/services/profileService';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, Model } from '../types/vehicle.types';

interface VehicleFormProps {
    vehicle?: Vehicle | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel }) => {
    const { user } = useAuth();
    const { 
        brands,
        loading, 
        error, 
        loadAllBrands, 
        createVehicle, 
        updateVehicle 
    } = useVehicle();

    const [formData, setFormData] = useState({
        licensePlate: '',
        modelId: 0,
        profileId: 0, // Inicializar en 0, se obtendrá el correcto después
        selectedBrandId: 0
    });

    const [formLoading, setFormLoading] = useState(false);
    const [availableModels, setAvailableModels] = useState<Model[]>([]);

    // Obtener el profileId correcto del usuario actual
    useEffect(() => {
        const getCurrentUserProfileId = async () => {
            try {
                const profile = await ProfileService.getCurrentUserProfile();
                if (profile) {
                    setFormData(prev => ({ ...prev, profileId: profile.id }));
                } else {
                    console.warn('Usuario no tiene perfil creado');
                }
            } catch (error) {
                console.error('Error al obtener perfil del usuario:', error);
            }
        };

        if (user && !vehicle) { // Solo obtener profileId para nuevos vehículos
            getCurrentUserProfileId();
        }
    }, [user, vehicle]);

    useEffect(() => {
        loadAllBrands();
    }, [loadAllBrands]);

    useEffect(() => {
        if (vehicle) {
            // Buscar la marca del vehículo existente
            const vehicleBrand = brands.find(brand => 
                brand.models?.some(model => model.id === vehicle.modelId)
            );
            
            setFormData({
                licensePlate: vehicle.licensePlate,
                modelId: vehicle.modelId,
                profileId: vehicle.profileId,
                selectedBrandId: vehicleBrand?.id || 0
            });
            
            // Configurar modelos disponibles para la marca del vehículo
            if (vehicleBrand?.models) {
                setAvailableModels(vehicleBrand.models);
            }
        }
    }, [vehicle, brands]);

    // Actualizar modelos disponibles cuando cambia la marca seleccionada
    useEffect(() => {
        if (formData.selectedBrandId > 0) {
            const selectedBrand = brands.find(brand => brand.id === formData.selectedBrandId);
            setAvailableModels(selectedBrand?.models || []);
            
            // Resetear modelo seleccionado si no es edición
            if (!vehicle) {
                setFormData(prev => ({ ...prev, modelId: 0 }));
            }
        } else {
            setAvailableModels([]);
            setFormData(prev => ({ ...prev, modelId: 0 }));
        }
    }, [formData.selectedBrandId, brands, vehicle]);

    const handleBrandChange = (brandId: number) => {
        setFormData(prev => ({ 
            ...prev, 
            selectedBrandId: brandId,
            modelId: 0 // Resetear modelo cuando cambia la marca
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.licensePlate.trim()) {
            alert('Por favor ingresa la placa del vehículo');
            return;
        }
        
        if (formData.selectedBrandId === 0) {
            alert('Por favor selecciona una marca');
            return;
        }
        
        if (formData.modelId === 0) {
            alert('Por favor selecciona un modelo');
            return;
        }

        // Validar que se tenga un profileId válido
        if (formData.profileId === 0) {
            alert('Error: No se pudo obtener el perfil del usuario. Por favor, recarga la página.');
            return;
        }

        try {
            setFormLoading(true);
            
            console.log('📝 Datos del formulario a enviar:', {
                licensePlate: formData.licensePlate,
                modelId: formData.modelId,
                profileId: formData.profileId
            });
            
            if (vehicle) {
                // Actualizar vehículo existente
                const updateData: UpdateVehicleRequest = {
                    licensePlate: formData.licensePlate,
                    modelId: formData.modelId
                };
                await updateVehicle(vehicle.id, updateData);
            } else {
                // Crear nuevo vehículo
                const createData: CreateVehicleRequest = {
                    licensePlate: formData.licensePlate,
                    modelId: formData.modelId,
                    profileId: formData.profileId
                };
                await createVehicle(createData);
            }
            
            onSubmit();
        } catch (err) {
            console.error('Error al guardar vehículo:', err);
            alert('Error al guardar vehículo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">
                {vehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                        Placa del Vehículo *
                    </label>
                    <input
                        type="text"
                        id="licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: ABC-123"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Marca del Vehículo *
                    </label>
                    <select
                        id="brand"
                        value={formData.selectedBrandId}
                        onChange={(e) => handleBrandChange(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value={0}>Selecciona una marca</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {brands.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            No hay marcas disponibles. Contacta al administrador.
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo del Vehículo *
                    </label>
                    <select
                        id="model"
                        value={formData.modelId}
                        onChange={(e) => setFormData(prev => ({ ...prev, modelId: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={formData.selectedBrandId === 0}
                        required
                    >
                        <option value={0}>
                            {formData.selectedBrandId === 0 ? 'Primero selecciona una marca' : 'Selecciona un modelo'}
                        </option>
                        {availableModels.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                    {formData.selectedBrandId > 0 && availableModels.length === 0 && (
                        <p className="text-sm text-yellow-600 mt-1">
                            Esta marca no tiene modelos disponibles. Contacta al administrador.
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={formLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={formLoading}
                    >
                        {formLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Guardando...
                            </div>
                        ) : (
                            vehicle ? 'Actualizar' : 'Agregar'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VehicleForm;
