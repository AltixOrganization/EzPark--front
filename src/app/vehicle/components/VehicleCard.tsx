// src/app/vehicle/components/VehicleCard.tsx

import React from 'react';
import type { Vehicle } from '../types/vehicle.types';

interface VehicleCardProps {
    vehicle: Vehicle;
    onEdit?: (vehicle: Vehicle) => void;
    onDelete?: (vehicleId: number) => void;
    showActions?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
    vehicle, 
    onEdit, 
    onDelete, 
    showActions = true 
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {vehicle.licensePlate}
                    </h3>
                    
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">Marca:</span>
                            <span>{vehicle.model?.brand?.name || 'No especificada'}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">Modelo:</span>
                            <span>{vehicle.model?.name || 'No especificado'}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">ID del Modelo:</span>
                            <span>#{vehicle.modelId}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg 
                            className="w-6 h-6 text-blue-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a3 3 0 01-3 3H6a3 3 0 01-3-3V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zM5 7v10a1 1 0 001 1h12a1 1 0 001-1V7H5z" 
                            />
                        </svg>
                    </div>
                </div>
            </div>
            
            {showActions && (
                <div className="mt-4 flex justify-end space-x-2">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(vehicle)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                            Editar
                        </button>
                    )}
                    
                    {onDelete && (
                        <button
                            onClick={() => onDelete(vehicle.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default VehicleCard;
