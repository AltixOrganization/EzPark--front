// src/app/parking/components/schedule/ScheduleCard.tsx

import React from 'react';
import type { Schedule } from '../../types/schedule.types';

interface ScheduleCardProps {
    schedule: Schedule;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    schedule,
    onEdit,
    onDelete,
    showActions = true
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5); // HH:mm
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">
                                {formatDate(schedule.day)}
                            </span>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            schedule.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {schedule.isAvailable ? 'Disponible' : 'Ocupado'}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </span>
                    </div>
                </div>

                {showActions && (
                    <div className="flex items-center space-x-2">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Editar horario"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                        
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Eliminar horario"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleCard;