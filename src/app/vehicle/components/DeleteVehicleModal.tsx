// src/app/vehicle/components/DeleteVehicleModal.tsx

import React from 'react';
import type { Vehicle } from '../types/vehicle.types';

interface DeleteVehicleModalProps {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({ 
    isOpen, 
    vehicle, 
    onConfirm, 
    onCancel, 
    loading = false 
}) => {
    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div 
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onCancel}
                ></div>

                {/* Modal */}
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                            <svg 
                                className="w-6 h-6 text-red-600 mt-2 ml-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Eliminar Vehículo
                            </h3>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">
                            ¿Estás seguro de que deseas eliminar este vehículo?
                        </p>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-gray-900">
                                Placa: {vehicle.licensePlate}
                            </p>
                            <p className="text-sm text-gray-600">
                                {vehicle.model?.brand?.name} {vehicle.model?.name}
                            </p>
                        </div>
                        <p className="text-sm text-red-600 mt-2">
                            Esta acción no se puede deshacer.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Eliminando...
                                </div>
                            ) : (
                                'Eliminar'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteVehicleModal;
