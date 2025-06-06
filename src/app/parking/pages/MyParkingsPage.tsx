// src/app/parking/pages/MyParkingsPage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParking } from '../hooks/useParking';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import ParkingCard from '../components/ParkingCard';
import EditParkingModal from '../components/EditParkingModal';
// import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Modal complejo comentado
import ParkingDetailsModal from '../components/ParkingDetailsModal'; // Nota: hay un typo en el nombre del archivo
import type { Parking } from '../types/parking.types';
import ScheduleManager from '../components/schedule/ScheduleManager';


const MyParkingsPage: React.FC = () => {
    const {
        userParkings,
        loading,
        error,
        deleteParking,
        deleting,
        loadUserParkings
    } = useParking();

    // Estados para los modales
    const [editingParking, setEditingParking] = useState<Parking | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal simple
    const [deletingParkingData, setDeletingParkingData] = useState<Parking | null>(null);
    const [viewingParking, setViewingParking] = useState<Parking | null>(null);
    const [showingSchedules, setShowingSchedules] = useState<Parking | null>(null);


    // Estados para filtros y ordenamiento
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');

    useEffect(() => {
        loadUserParkings();
    }, []);

    // Handlers para los modales
    const handleEditParking = (parking: Parking) => {
        setEditingParking(parking);
    };

    const handleViewParking = (parking: Parking) => {
        setViewingParking(parking);
    };

    const handleDeleteParking = (parking: Parking) => {
        setDeletingParkingData(parking);
        setShowDeleteModal(true);
    };

    const confirmDeleteParking = async () => {
        if (deletingParkingData?.id) {
            const success = await deleteParking(deletingParkingData.id);
            if (success) {
                setShowDeleteModal(false);
                setDeletingParkingData(null);
                // Recargar la lista
                loadUserParkings();
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingParkingData(null);
    };
    {/*
    const closeAllModals = () => {
        setEditingParking(null);
        setShowDeleteModal(false);
        setDeletingParkingData(null);
        setViewingParking(null);
    };

    const handleManageSchedules = (parking: Parking) => {
        setShowingSchedules(parking);
    };*/}


    // Filtrar y ordenar estacionamientos
    const filteredAndSortedParkings = React.useMemo(() => {
        let filtered = [...userParkings];

        // Aplicar filtro de estado
        if (statusFilter === 'active') {
            filtered = filtered.filter(p => p.space > 0);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(p => p.space === 0);
        }

        // Aplicar ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return b.price - a.price;
                case 'name':
                    return a.location.district.localeCompare(b.location.district);
                case 'date':
                default:
                    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
            }
        });

        return filtered;
    }, [userParkings, statusFilter, sortBy]);

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando tus estacionamientos..." />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Estacionamientos</h1>
                        <p className="text-gray-600 mt-2">
                            Gestiona tus espacios de estacionamiento registrados
                        </p>
                    </div>
                    <Link
                        to="/publish-garage"
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Agregar Estacionamiento</span>
                    </Link>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {userParkings.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No tienes estacionamientos registrados
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Comienza a generar ingresos registrando tu primer espacio de estacionamiento.
                            Es rápido y fácil.
                        </p>
                        <Link
                            to="/publish-garage"
                            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Registrar mi primer estacionamiento</span>
                        </Link>
                    </div>
                ) : (
                    /* Parking List */
                    <div>
                        {/* Filtros y ordenamiento */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">
                                {filteredAndSortedParkings.length} de {userParkings.length} estacionamiento{userParkings.length !== 1 ? 's' : ''} mostrado{userParkings.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center space-x-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Todos los estados</option>
                                    <option value="active">Activos (disponibles)</option>
                                    <option value="inactive">Sin espacios</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'name')}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="date">Ordenar por fecha</option>
                                    <option value="price">Ordenar por precio</option>
                                    <option value="name">Ordenar por distrito</option>
                                </select>
                            </div>
                        </div>

                        {/* Lista de estacionamientos */}
                        {filteredAndSortedParkings.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No hay estacionamientos que coincidan con los filtros seleccionados.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAndSortedParkings.map((parking) => (
                                    <ParkingCard
                                        key={parking.id}
                                        parking={parking}
                                        onEdit={() => handleEditParking(parking)}
                                        onDelete={() => handleDeleteParking(parking)}
                                        onView={() => handleViewParking(parking)}
                                        isOwner={true}
                                        deleting={deleting}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Statistics Section */}
                {userParkings.length > 0 && (
                    <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de tus estacionamientos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{userParkings.length}</p>
                                <p className="text-sm text-gray-600">Estacionamientos</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">
                                    S/ {(userParkings.reduce((total, parking) => total + parking.price, 0) / userParkings.length).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">Precio promedio/hora</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {userParkings.reduce((total, parking) => total + parking.space, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Espacios totales</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">
                                    {userParkings.filter(p => p.space > 0).length}
                                </p>
                                <p className="text-sm text-gray-600">Activos disponibles</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}

            {/* Modal de edición */}
            {editingParking && (
                <EditParkingModal
                    parking={editingParking}
                    onClose={() => {
                        setEditingParking(null);
                        // Recargar datos después de editar
                        loadUserParkings();
                    }}
                />
            )}

            {/* Modal simple de confirmación de eliminación */}
            {showDeleteModal && deletingParkingData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                ¿Estás seguro?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                ¿Quieres eliminar el estacionamiento en {deletingParkingData.location.district}?
                                <br />
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={cancelDelete}
                                    disabled={deleting}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                                >
                                    No, cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteParking}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {deleting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Sí, eliminar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de detalles */}
            {viewingParking && (
                <ParkingDetailsModal
                    parking={viewingParking}
                    onClose={() => setViewingParking(null)}
                    onEdit={() => {
                        setViewingParking(null);
                        setEditingParking(viewingParking);
                    }}
                    onDelete={() => {
                        setViewingParking(null);
                        setDeletingParkingData(viewingParking);
                    }}
                    isOwner={true}
                />
            )}

            {showingSchedules && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">
                                    Horarios - {showingSchedules.location.district}
                                </h2>
                                <button
                                    onClick={() => setShowingSchedules(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ScheduleManager
                                parkingId={showingSchedules.id!}
                                parkingName={showingSchedules.location.district}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyParkingsPage;