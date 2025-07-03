// src/app/vehicle/pages/MyVehiclesPage.tsx

import React, { useEffect, useState } from 'react';
import { useVehicle } from '../hooks/useVehicle';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import VehicleList from '../components/VehicleList';
import VehicleModal from '../components/VehicleModal';
import DeleteVehicleModal from '../components/DeleteVehicleModal';
import type { Vehicle } from '../types/vehicle.types';

const MyVehiclesPage: React.FC = () => {
    const { 
        vehicles, 
        loading, 
        error, 
        loadVehiclesForCurrentUser, 
        deleteVehicle
    } = useVehicle();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        // Usar el método optimizado que obtiene el profileId correctamente
        loadVehiclesForCurrentUser();
    }, [loadVehiclesForCurrentUser]);

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
    };

    const handleDelete = (vehicleId: number) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            setDeletingVehicle(vehicle);
        }
    };

    const confirmDelete = async () => {
        if (!deletingVehicle) return;

        try {
            setDeleteLoading(true);
            await deleteVehicle(deletingVehicle.id);
            setDeletingVehicle(null);
        } catch (err) {
            console.error('Error al eliminar vehículo:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleVehicleSubmit = () => {
        // Recargar vehículos usando el método optimizado
        loadVehiclesForCurrentUser();
        setEditingVehicle(null);
        setShowAddModal(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Vehículos</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona tus vehículos registrados para hacer reservas de estacionamiento
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 4v16m8-8H4" 
                        />
                    </svg>
                    Agregar Vehículo
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <VehicleList
                vehicles={vehicles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
            />

            {/* Modal para agregar vehículo */}
            <VehicleModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleVehicleSubmit}
            />

            {/* Modal para editar vehículo */}
            <VehicleModal
                isOpen={!!editingVehicle}
                vehicle={editingVehicle}
                onClose={() => setEditingVehicle(null)}
                onSubmit={handleVehicleSubmit}
            />

            {/* Modal para eliminar vehículo */}
            <DeleteVehicleModal
                isOpen={!!deletingVehicle}
                vehicle={deletingVehicle}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingVehicle(null)}
                loading={deleteLoading}
            />
        </div>
    );
};

export default MyVehiclesPage;
