// src/app/vehicle/components/VehicleList.tsx

import React from 'react';
import VehicleCard from './VehicleCard';
import type { Vehicle } from '../types/vehicle.types';

interface VehicleListProps {
    vehicles: Vehicle[];
    onEdit?: (vehicle: Vehicle) => void;
    onDelete?: (vehicleId: number) => void;
    showActions?: boolean;
    emptyMessage?: string;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
    vehicles, 
    onEdit, 
    onDelete, 
    showActions = true,
    emptyMessage = "No tienes vehículos registrados"
}) => {
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg 
                        className="w-12 h-12 text-gray-400" 
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {emptyMessage}
                </h3>
                <p className="text-gray-500">
                    Agrega tu primer vehículo para poder hacer reservas de estacionamiento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showActions={showActions}
                />
            ))}
        </div>
    );
};

export default VehicleList;
