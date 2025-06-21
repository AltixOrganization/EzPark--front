// src/app/schedule/components/ScheduleForm.tsx

import React, { useState, useEffect } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Schedule, ScheduleFormData } from '../types/schedule.types';

interface ScheduleFormProps {
    schedule?: Schedule | null;
    parkingId?: number;
    initialDate?: string;
    onSubmit: () => void;
    onCancel: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ 
    schedule, 
    parkingId,
    initialDate,
    onSubmit, 
    onCancel 
}) => {
    const { loading, error, createSchedule, updateSchedule } = useSchedule();

    const [formData, setFormData] = useState<ScheduleFormData>({
        parkingId: parkingId || schedule?.parkingId || 0,
        day: initialDate || schedule?.day || '',
        startTime: schedule?.startTime || '08:00',
        endTime: schedule?.endTime || '18:00'
    });

    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (schedule) {
            setFormData({
                parkingId: schedule.parkingId,
                day: schedule.day,
                startTime: schedule.startTime.substring(0, 5), // Remove seconds
                endTime: schedule.endTime.substring(0, 5) // Remove seconds
            });
        }
    }, [schedule]);

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.parkingId) {
            alert('ID del estacionamiento es requerido');
            return;
        }

        if (!formData.day) {
            alert('Por favor selecciona una fecha');
            return;
        }

        if (!formData.startTime || !formData.endTime) {
            alert('Por favor ingresa las horas de inicio y fin');
            return;
        }

        if (formData.startTime >= formData.endTime) {
            alert('La hora de inicio debe ser anterior a la hora de fin');
            return;
        }

        // Validate that the date is not in the past
        const selectedDate = new Date(formData.day);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        if (selectedDate < today) {
            alert('No se pueden crear horarios para fechas pasadas');
            return;
        }

        try {
            setFormLoading(true);
            
            // Add seconds to time format (backend expects HH:mm:ss)
            const scheduleData: ScheduleFormData = {
                ...formData,
                startTime: formData.startTime + ':00',
                endTime: formData.endTime + ':00'
            };

            if (schedule) {
                // Update existing schedule
                await updateSchedule(schedule.id, scheduleData);
            } else {
                // Create new schedule
                await createSchedule(scheduleData);
            }
            
            onSubmit();
        } catch (err) {
            console.error('Error al guardar horario:', err);
            alert('Error al guardar horario: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        } finally {
            setFormLoading(false);
        }
    };

    const handleInputChange = (field: keyof ScheduleFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {schedule ? 'Editar Horario' : 'Crear Nuevo Horario'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Parking ID (hidden if provided) */}
                {!parkingId && (
                    <div>
                        <label htmlFor="parkingId" className="block text-sm font-medium text-gray-700 mb-1">
                            ID del Estacionamiento *
                        </label>
                        <input
                            type="number"
                            id="parkingId"
                            min="1"
                            value={formData.parkingId || ''}
                            onChange={(e) => handleInputChange('parkingId', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                )}

                {/* Date */}
                <div>
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha *
                    </label>
                    <input
                        type="date"
                        id="day"
                        min={getTodayDate()}
                        value={formData.day}
                        onChange={(e) => handleInputChange('day', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        No se pueden crear horarios para fechas pasadas
                    </p>
                </div>

                {/* Start Time */}
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Inicio *
                    </label>
                    <input
                        type="time"
                        id="startTime"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* End Time */}
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Fin *
                    </label>
                    <input
                        type="time"
                        id="endTime"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Duration Display */}
                {formData.startTime && formData.endTime && formData.startTime < formData.endTime && (
                    <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Duración:</strong> {(() => {
                                const start = new Date(`2000-01-01T${formData.startTime}:00`);
                                const end = new Date(`2000-01-01T${formData.endTime}:00`);
                                const diffMs = end.getTime() - start.getTime();
                                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                
                                if (diffMinutes === 0) {
                                    return `${diffHours} horas`;
                                }
                                return `${diffHours} horas y ${diffMinutes} minutos`;
                            })()}
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        disabled={formLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={formLoading}
                    >
                        {formLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </>
                        ) : (
                            schedule ? 'Actualizar Horario' : 'Crear Horario'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleForm;
