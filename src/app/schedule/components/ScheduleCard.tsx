// src/app/schedule/components/ScheduleCard.tsx

import React from 'react';
import type { Schedule } from '../types/schedule.types';

interface ScheduleCardProps {
    schedule: Schedule;
    showParkingInfo?: boolean;
    onEdit?: (schedule: Schedule) => void;
    onDelete?: (scheduleId: number) => void;
    onSelect?: (schedule: Schedule) => void;
    isSelected?: boolean;
    isSelectable?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
    schedule, 
    showParkingInfo = false,
    onEdit, 
    onDelete, 
    onSelect,
    isSelected = false,
    isSelectable = false
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDuration = () => {
        const start = new Date(`2000-01-01T${schedule.startTime}`);
        const end = new Date(`2000-01-01T${schedule.endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffMinutes === 0) {
            return `${diffHours}h`;
        }
        return `${diffHours}h ${diffMinutes}m`;
    };

    const handleCardClick = () => {
        if (isSelectable && onSelect && schedule.isAvailable) {
            onSelect(schedule);
        }
    };

    const cardClasses = `
        bg-white rounded-lg border shadow-sm p-4 transition-all duration-200
        ${schedule.isAvailable 
            ? 'border-green-200 hover:border-green-300' 
            : 'border-gray-200 bg-gray-50'
        }
        ${isSelectable && schedule.isAvailable 
            ? 'cursor-pointer hover:shadow-md' 
            : ''
        }
        ${isSelected 
            ? 'ring-2 ring-blue-500 border-blue-300' 
            : ''
        }
    `.trim();

    return (
        <div className={cardClasses} onClick={handleCardClick}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                        schedule.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-600">
                        {schedule.isAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                </div>
                
                {(onEdit || onDelete) && (
                    <div className="flex items-center space-x-1">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(schedule);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Editar horario"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
                                        onDelete(schedule.id);
                                    }
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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

            {/* Fecha */}
            <div className="mb-2">
                <p className="font-medium text-gray-900 capitalize">
                    {formatDate(schedule.day)}
                </p>
                <p className="text-sm text-gray-500">{schedule.day}</p>
            </div>

            {/* Horario */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {getDuration()}
                </span>
            </div>

            {/* Información del estacionamiento (opcional) */}
            {showParkingInfo && schedule.parking && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {schedule.parking.space}
                            </p>
                            <p className="text-xs text-gray-500">
                                {schedule.parking.description}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-green-600">
                                S/ {schedule.parking.price}/h
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Indicador de selección */}
            {isSelectable && schedule.isAvailable && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-500">
                        {isSelected ? '✓ Seleccionado' : 'Clic para seleccionar'}
                    </p>
                </div>
            )}

            {/* Mensaje si no está disponible */}
            {!schedule.isAvailable && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-500">
                        Este horario no está disponible
                    </p>
                </div>
            )}
        </div>
    );
};

export default ScheduleCard;
