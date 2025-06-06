// src/app/parking/components/schedule/ScheduleList.tsx

import React from 'react';
import ScheduleCard from './ScheduleCard';
import type { Schedule } from '../../types/schedule.types';

interface ScheduleListProps {
    schedules: Schedule[];
    onEditSchedule?: (schedule: Schedule) => void;
    onDeleteSchedule?: (schedule: Schedule) => void;
    loading?: boolean;
    emptyMessage?: string;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
    schedules,
    onEditSchedule,
    onDeleteSchedule,
    loading = false,
    emptyMessage = "No hay horarios disponibles"
}) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-20"></div>
                ))}
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sin horarios
                </h3>
                <p className="text-gray-600">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    // Ordenar horarios por fecha y hora
    const sortedSchedules = [...schedules].sort((a, b) => {
        const dateComparison = new Date(a.day).getTime() - new Date(b.day).getTime();
        if (dateComparison !== 0) return dateComparison;
        
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div className="space-y-3">
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {schedules.length} horario{schedules.length !== 1 ? 's' : ''} encontrado{schedules.length !== 1 ? 's' : ''}
                </p>
            </div>
            
            {sortedSchedules.map((schedule) => (
                <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={onEditSchedule ? () => onEditSchedule(schedule) : undefined}
                    onDelete={onDeleteSchedule ? () => onDeleteSchedule(schedule) : undefined}
                    showActions={!!(onEditSchedule || onDeleteSchedule)}
                />
            ))}
        </div>
    );
};

export default ScheduleList;