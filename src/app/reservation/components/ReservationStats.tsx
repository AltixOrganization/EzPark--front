// src/app/reservation/components/ReservationStats.tsx

import React from 'react';
import type { Reservation } from '../types/reservation.types';

interface ReservationStatsProps {
    reservations: Reservation[];
}

const ReservationStats: React.FC<ReservationStatsProps> = ({ reservations }) => {
    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'Pending').length,
        approved: reservations.filter(r => r.status === 'Approved').length,
        inProgress: reservations.filter(r => r.status === 'InProgress').length,
        completed: reservations.filter(r => r.status === 'Completed').length,
        totalEarnings: reservations
            .filter(r => r.status === 'Completed')
            .reduce((sum, r) => sum + r.totalFare, 0),
        avgDuration: reservations.length > 0 
            ? reservations.reduce((sum, r) => sum + r.hoursRegistered, 0) / reservations.length 
            : 0
    };

    const getUrgentCount = () => {
        const now = new Date();
        return reservations.filter(r => {
            if (r.status !== 'Pending') return false;
            const reservationDate = new Date(r.reservationDate);
            const diffHours = (reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            return diffHours < 24;
        }).length;
    };

    const urgentCount = getUrgentCount();

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Total */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </div>

                    {/* Pending with urgent indicator */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            {urgentCount > 0 && (
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title={`${urgentCount} urgentes`}></div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">Pendientes</div>
                        {urgentCount > 0 && (
                            <div className="text-xs text-red-600 font-medium">{urgentCount} urgentes</div>
                        )}
                    </div>

                    {/* Approved */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
                        <div className="text-sm text-gray-500">Aprobadas</div>
                    </div>

                    {/* In Progress */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.inProgress}</div>
                        <div className="text-sm text-gray-500">En Progreso</div>
                    </div>

                    {/* Completed */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
                        <div className="text-sm text-gray-500">Completadas</div>
                    </div>

                    {/* Earnings */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">S/ {stats.totalEarnings.toFixed(0)}</div>
                        <div className="text-sm text-gray-500">Ganancias</div>
                    </div>
                </div>

                {/* Additional info bar */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-6">
                        <span>Duración promedio: {stats.avgDuration.toFixed(1)}h</span>
                        <span>Tarifa promedio: S/ {stats.completed > 0 ? (stats.totalEarnings / stats.completed).toFixed(2) : '0.00'}</span>
                    </div>
                    
                    {urgentCount > 0 && (
                        <div className="flex items-center space-x-2 text-red-600">
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{urgentCount} solicitudes requieren atención urgente</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationStats;
