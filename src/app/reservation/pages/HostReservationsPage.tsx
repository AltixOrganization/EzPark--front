// src/app/reservation/pages/HostReservationsPage.tsx

import React, { useState, useEffect } from 'react';
import { useReservation } from '../hooks/useReservation';
import ExpandableReservationCard from '../components/ExpandableReservationCard';
import ReservationStats from '../components/ReservationStats';
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

    // Update selectAll state based on selected reservations
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📧 Solicitudes de Reserva</h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona las reservas de tus estacionamientos con vista tipo bandeja
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Header */}
            <ReservationStats reservations={reservations} />

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar with filters */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Estados</h3>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>📋 Todas</span>
                                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                        {getFilterCount('all')}
                                    </span>
                                </div>
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    filter === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>⏳ Pendientes</span>
                                    <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                        {getFilterCount('pending')}
                                    </span>
                                </div>
                            </button>
                            <button
                                onClick={() => setFilter('approved')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    filter === 'approved'
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>✅ Aprobadas</span>
                                    <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        {getFilterCount('approved')}
                                    </span>
                                </div>
                            </button>
                            <button
                                onClick={() => setFilter('inprogress')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    filter === 'inprogress'
                                        ? 'bg-green-100 text-green-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>🚀 En Progreso</span>
                                    <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-xs">
                                        {getFilterCount('inprogress')}
                                    </span>
                                </div>
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    filter === 'completed'
                                        ? 'bg-gray-100 text-gray-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>🏁 Completadas</span>
                                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                        {getFilterCount('completed')}
                                    </span>
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 bg-white">
                    {error && (
                        <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Reservations list */}
                    <div className="divide-y divide-gray-200">
                        {filteredReservations.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {filter === 'all' ? 'No hay solicitudes aún' : 
                                     filter === 'pending' ? 'No hay solicitudes pendientes' :
                                     filter === 'approved' ? 'No hay solicitudes aprobadas' :
                                     filter === 'inprogress' ? 'No hay solicitudes en progreso' :
                                     filter === 'completed' ? 'No hay solicitudes completadas' : 'No hay solicitudes'}
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {filter === 'all' 
                                        ? 'Las solicitudes de reserva aparecerán aquí cuando los usuarios reserven tus estacionamientos'
                                        : `Las solicitudes ${
                                            filter === 'pending' ? 'pendientes' :
                                            filter === 'approved' ? 'aprobadas' :
                                            filter === 'inprogress' ? 'en progreso' :
                                            'completadas'
                                          } aparecerán en esta vista`
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredReservations.map(reservation => (
                                <ExpandableReservationCard
                                    key={reservation.id}
                                    reservation={reservation}
                                    onUpdateStatus={handleUpdateStatus}
                                    showActions={true}
                                    isHost={true}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostReservationsPage;
