// src/app/schedule/components/ScheduleList.tsx

import React, { useState } from 'react';
import ScheduleCard from './ScheduleCard';
import ScheduleForm from './ScheduleForm';
import type { Schedule } from '../types/schedule.types';

interface ScheduleListProps {
    schedules: Schedule[];
    title?: string;
    parkingId?: number;
    showParkingInfo?: boolean;
    allowEdit?: boolean;
    allowDelete?: boolean;
    allowCreate?: boolean;
    isSelectable?: boolean;
    selectedSchedule?: Schedule | null;
    onScheduleSelect?: (schedule: Schedule) => void;
    onScheduleUpdate?: () => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
    schedules,
    title = "Horarios",
    parkingId,
    showParkingInfo = false,
    allowEdit = false,
    allowDelete = false,
    allowCreate = false,
    isSelectable = false,
    selectedSchedule,
    onScheduleSelect,
    onScheduleUpdate
}) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');

    // Filter schedules based on current filter
    const filteredSchedules = schedules.filter(schedule => {
        switch (filter) {
            case 'available':
                return schedule.isAvailable;
            case 'unavailable':
                return !schedule.isAvailable;
            default:
                return true;
        }
    });

    // Group schedules by date
    const schedulesByDate = filteredSchedules.reduce((acc, schedule) => {
        const date = schedule.day;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(schedule);
        return acc;
    }, {} as Record<string, Schedule[]>);

    // Sort dates and schedules within each date
    const sortedDates = Object.keys(schedulesByDate).sort();
    sortedDates.forEach(date => {
        schedulesByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    const handleEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
    };

    const handleFormSubmit = () => {
        setShowCreateForm(false);
        setEditingSchedule(null);
        if (onScheduleUpdate) {
            onScheduleUpdate();
        }
    };

    const handleFormCancel = () => {
        setShowCreateForm(false);
        setEditingSchedule(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Statistics
    const availableCount = schedules.filter(s => s.isAvailable).length;
    const unavailableCount = schedules.filter(s => !s.isAvailable).length;

    if (showCreateForm || editingSchedule) {
        return (
            <ScheduleForm
                schedule={editingSchedule}
                parkingId={parkingId}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    {schedules.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {schedules.length} horario{schedules.length !== 1 ? 's' : ''} total{schedules.length !== 1 ? 'es' : ''}
                            {availableCount > 0 && (
                                <span className="text-green-600 ml-2">
                                    ({availableCount} disponible{availableCount !== 1 ? 's' : ''})
                                </span>
                            )}
                        </p>
                    )}
                </div>

                {allowCreate && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Nuevo Horario</span>
                    </button>
                )}
            </div>

            {/* Statistics */}
            {schedules.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
                        <div className="text-sm text-blue-800">Total</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{availableCount}</div>
                        <div className="text-sm text-green-800">Disponibles</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{unavailableCount}</div>
                        <div className="text-sm text-gray-800">No disponibles</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            {schedules.length > 0 && (
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Filtrar:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'available' | 'unavailable')}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos los horarios</option>
                        <option value="available">Solo disponibles</option>
                        <option value="unavailable">Solo no disponibles</option>
                    </select>
                </div>
            )}

            {/* Schedule List */}
            {filteredSchedules.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {schedules.length === 0 ? 'No hay horarios' : 'No hay horarios que coincidan con el filtro'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {schedules.length === 0 
                            ? 'No se han creado horarios para este estacionamiento.'
                            : 'Intenta cambiar el filtro para ver más resultados.'
                        }
                    </p>
                    {allowCreate && schedules.length === 0 && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Crear Primer Horario
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedDates.map(date => (
                        <div key={date} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 capitalize border-b border-gray-200 pb-2">
                                {formatDate(date)}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {schedulesByDate[date].map(schedule => (
                                    <ScheduleCard
                                        key={schedule.id}
                                        schedule={schedule}
                                        showParkingInfo={showParkingInfo}
                                        onEdit={allowEdit ? handleEdit : undefined}
                                        onDelete={allowDelete ? () => {
                                            // The delete logic would be handled by the parent component
                                            if (onScheduleUpdate) onScheduleUpdate();
                                        } : undefined}
                                        onSelect={onScheduleSelect}
                                        isSelected={selectedSchedule?.id === schedule.id}
                                        isSelectable={isSelectable}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduleList;
