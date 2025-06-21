// src/app/reservation/pages/HostReservationsPage.tsx

import React, { useState, useEffect } from 'react';
import { useReservation } from '../hooks/useReservation';
import ReservationCard from '../components/ReservationCard';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const HostReservationsPage: React.FC = () => {
    const { reservations, loading, error, loadHostReservations, updateReservationStatus } = useReservation();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'inprogress' | 'completed'>('all');

    useEffect(() => {
        loadHostReservations();
    }, [loadHostReservations]);

    const handleUpdateStatus = async (reservationId: number, newStatus: string) => {
        try {
            await updateReservationStatus(reservationId, newStatus);
        } catch (err) {
            console.error('Error updating reservation status:', err);
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        if (filter === 'all') return true;
        const status = reservation.status.toLowerCase();
        if (filter === 'inprogress') return status === 'inprogress';
        return status === filter;
    });

    const getFilterCount = (filterType: string) => {
        if (filterType === 'all') return reservations.length;
        if (filterType === 'inprogress') {
            return reservations.filter(r => r.status.toLowerCase() === 'inprogress').length;
        }
        return reservations.filter(r => r.status.toLowerCase() === filterType).length;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Reserva</h1>
                <p className="text-gray-600 mt-2">
                    Gestiona las reservas de tus estacionamientos
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-8">
                <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            filter === 'all'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Todas ({getFilterCount('all')})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            filter === 'pending'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Pendientes ({getFilterCount('pending')})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            filter === 'approved'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Aprobadas ({getFilterCount('approved')})
                    </button>
                    <button
                        onClick={() => setFilter('inprogress')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            filter === 'inprogress'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        En Progreso ({getFilterCount('inprogress')})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            filter === 'completed'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Completadas ({getFilterCount('completed')})
                    </button>
                </nav>
            </div>

            {/* Reservations List */}
            {filteredReservations.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'No hay reservas aún' : 
                         filter === 'pending' ? 'No hay reservas pendientes' :
                         filter === 'approved' ? 'No hay reservas aprobadas' :
                         filter === 'inprogress' ? 'No hay reservas en progreso' :
                         filter === 'completed' ? 'No hay reservas completadas' : 'No hay reservas'}
                    </h3>
                    <p className="text-gray-500">
                        {filter === 'all' 
                            ? 'Las solicitudes de reserva aparecerán aquí cuando los usuarios reserven tus estacionamientos'
                            : `Las reservas ${
                                filter === 'pending' ? 'pendientes' :
                                filter === 'approved' ? 'aprobadas' :
                                filter === 'inprogress' ? 'en progreso' :
                                'completadas'
                              } aparecerán aquí`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {filteredReservations.map(reservation => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onUpdateStatus={handleUpdateStatus}
                            showActions={true}
                            isHost={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostReservationsPage;
