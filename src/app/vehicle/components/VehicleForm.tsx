// src/app/vehicle/components/VehicleForm.tsx

import React, { useState, useEffect } from 'react';
import { useVehicle } from '../hooks/useVehicle';
import { useAuth } from '../../shared/hooks/useAuth';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest } from '../types/vehicle.types';

interface VehicleFormProps {
    vehicle?: Vehicle | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel }) => {
    const { user } = useAuth();
    const { 
        loading, 
        error, 
        loadAllBrands, 
        createVehicle, 
        updateVehicle 
    } = useVehicle();

    const [formData, setFormData] = useState({
        licensePlate: '',
        modelId: 0,
        profileId: user?.id || 0,
        // Temporary fields for manual input
        brandName: '',
        modelName: ''
    });

    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadAllBrands();
    }, [loadAllBrands]);

    useEffect(() => {
        if (vehicle) {
            setFormData({
                licensePlate: vehicle.licensePlate,
                modelId: vehicle.modelId,
                profileId: vehicle.profileId,
                brandName: vehicle.model?.brand?.name || '',
                modelName: vehicle.model?.name || ''
            });
        }
    }, [vehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.licensePlate.trim()) {
            alert('Por favor ingresa la placa del vehículo');
            return;
        }
        
        if (!formData.brandName.trim()) {
            alert('Por favor ingresa la marca del vehículo');
            return;
        }
        
        if (!formData.modelName.trim()) {
            alert('Por favor ingresa el modelo del vehículo');
            return;
        }

        try {
            setFormLoading(true);
            
            // For now, create a temporary model with modelId = 1
            // This should be replaced when your backend has proper model endpoints
            const tempModelId = 1;
            
            if (vehicle) {
                // Actualizar vehículo existente
                const updateData: UpdateVehicleRequest = {
                    licensePlate: formData.licensePlate,
                    modelId: tempModelId
                };
                await updateVehicle(vehicle.id, updateData);
            } else {
                // Crear nuevo vehículo
                const createData: CreateVehicleRequest = {
                    licensePlate: formData.licensePlate,
                    modelId: tempModelId,
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
                        maxLength={8}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                        Marca del Vehículo *
                    </label>
                    <input
                        type="text"
                        id="brandName"
                        value={formData.brandName}
                        onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Toyota, Honda, Hyundai"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo del Vehículo *
                    </label>
                    <input
                        type="text"
                        id="modelName"
                        value={formData.modelName}
                        onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Corolla, Civic, Elantra"
                        required
                    />
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
