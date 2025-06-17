// src/app/vehicle/components/VehicleModal.tsx

import React from 'react';
import VehicleForm from './VehicleForm';
import type { Vehicle } from '../types/vehicle.types';

interface VehicleModalProps {
    isOpen: boolean;
    vehicle?: Vehicle | null;
    onClose: () => void;
    onSubmit: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ 
    isOpen, 
    vehicle, 
    onClose, 
    onSubmit 
}) => {
    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div 
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <VehicleForm
                        vehicle={vehicle}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default VehicleModal;
