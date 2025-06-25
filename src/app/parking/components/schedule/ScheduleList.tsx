// src/app/parking/components/schedule/ScheduleList.tsx

import React from 'react';
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

    // Función para agrupar horarios por día
    const groupSchedulesByDay = (schedules: Schedule[]) => {
        const grouped = schedules.reduce((acc, schedule) => {
            const date = schedule.day;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(schedule);
            return acc;
        }, {} as Record<string, Schedule[]>);

        // Ordenar por fecha y dentro de cada fecha por hora
        return Object.entries(grouped)
            .map(([date, daySchedules]) => ({
                date,
                schedules: daySchedules.sort((a, b) => a.startTime.localeCompare(b.startTime))
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const allowEdit = !!onEditSchedule;
    const allowDelete = !!onDeleteSchedule;

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {schedules.length} horario{schedules.length !== 1 ? 's' : ''} encontrado{schedules.length !== 1 ? 's' : ''}
                </p>
            </div>
            
            {groupSchedulesByDay(schedules).map(({ date, schedules: daySchedules }) => (
                <div key={date} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                        <span className="ml-2 text-sm text-gray-500">
                            ({daySchedules.length} horario{daySchedules.length !== 1 ? 's' : ''})
                        </span>
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                        {daySchedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className={`p-3 rounded-md border transition-colors ${
                                    schedule.isAvailable
                                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                        : 'bg-red-50 border-red-200'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-sm font-medium text-gray-900">
                                        {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                                    </div>
                                    <div className={`text-xs mt-1 ${
                                        schedule.isAvailable ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {schedule.isAvailable ? 'Disponible' : 'Ocupado'}
                                    </div>
                                    
                                    {/* Botones de acción */}
                                    {(allowEdit || allowDelete) && (
                                        <div className="flex justify-center space-x-1 mt-2">
                                            {allowEdit && (
                                                <button
                                                    onClick={() => onEditSchedule?.(schedule)}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                    title="Editar horario"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            )}
                                            {allowDelete && (
                                                <button
                                                    onClick={() => onDeleteSchedule?.(schedule)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    title="Eliminar horario"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScheduleList;