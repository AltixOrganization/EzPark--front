// src/app/parking/pages/MyParkingsPage.tsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParking } from '../hooks/useParking';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import ParkingCard from '../components/ParkingCard';

const MyParkingsPage: React.FC = () => {
    const { 
        userParkings, 
        loading, 
        error, 
        deleteParking, 
        deleting,
        loadUserParkings 
    } = useParking();

    useEffect(() => {
        loadUserParkings();
    }, []);

    const handleDeleteParking = async (parkingId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este estacionamiento?')) {
            await deleteParking(parkingId);
        }
    };

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
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-gray-600">
                                {userParkings.length} estacionamiento{userParkings.length !== 1 ? 's' : ''} registrado{userParkings.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center space-x-4">
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option>Todos los estados</option>
                                    <option>Activos</option>
                                    <option>Inactivos</option>
                                </select>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option>Ordenar por fecha</option>
                                    <option>Ordenar por precio</option>
                                    <option>Ordenar por nombre</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userParkings.map((parking) => (
                                <ParkingCard
                                    key={parking.id}
                                    parking={parking}
                                    onDelete={() => handleDeleteParking(parking.id!)}
                                    isOwner={true}
                                    deleting={deleting}
                                />
                            ))}
                        </div>
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
                                    S/ {userParkings.reduce((total, parking) => total + parking.price, 0).toFixed(2)}
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
                                <p className="text-2xl font-bold text-purple-600">0</p>
                                <p className="text-sm text-gray-600">Reservas activas</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyParkingsPage;