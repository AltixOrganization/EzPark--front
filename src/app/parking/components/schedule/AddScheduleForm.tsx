// src/app/parking/components/schedule/AddScheduleForm.tsx

import React, { useState } from 'react';
import type { ScheduleFormData } from '../../types/schedule.types';

interface AddScheduleFormProps {
    parkingId: number;
    onSubmit: (data: ScheduleFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const AddScheduleForm: React.FC<AddScheduleFormProps> = ({
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState<ScheduleFormData>({
        day: '',
        startTime: '',
        endTime: ''
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar errores al escribir
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const validateForm = (): string[] => {
        const validationErrors: string[] = [];

        if (!formData.day) {
            validationErrors.push('La fecha es requerida');
        }

        if (!formData.startTime) {
            validationErrors.push('La hora de inicio es requerida');
        }

        if (!formData.endTime) {
            validationErrors.push('La hora de fin es requerida');
        }

        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
            validationErrors.push('La hora de inicio debe ser anterior a la hora de fin');
        }

        // Validar que la fecha no sea en el pasado
        if (formData.day) {
            const selectedDate = new Date(formData.day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                validationErrors.push('No puedes crear horarios para fechas pasadas');
            }
        }

        return validationErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onSubmit(formData);
            // Limpiar formulario si es exitoso
            setFormData({
                day: '',
                startTime: '',
                endTime: ''
            });
        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    // Función para generar vista previa de horarios
    const previewGeneratedSchedules = () => {
        if (!formData.startTime || !formData.endTime || !formData.day) {
            return [];
        }

        const schedules = [];
        const startDate = new Date(`2000-01-01T${formData.startTime}`);
        const endDate = new Date(`2000-01-01T${formData.endTime}`);
        
        if (startDate >= endDate) {
            return [];
        }
        
        let currentTime = new Date(startDate);
        
        while (currentTime < endDate) {
            const nextHour = new Date(currentTime);
            nextHour.setHours(nextHour.getHours() + 1);
            
            if (nextHour > endDate) {
                nextHour.setTime(endDate.getTime());
            }
            
            const scheduleStartTime = currentTime.toTimeString().slice(0, 5);
            const scheduleEndTime = nextHour.toTimeString().slice(0, 5);
            
            schedules.push({
                start: scheduleStartTime,
                end: scheduleEndTime
            });
            
            currentTime = new Date(nextHour);
        }
        
        return schedules;
    };

    // Obtener fecha mínima (hoy)
    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Agregar Nuevo Horario
            </h3>

            {/* Errores de validación */}
            {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fecha */}
                <div>
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="day"
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Horarios */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Hora de inicio
                        </label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Hora de fin
                        </label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Vista previa de horarios */}
                {formData.startTime && formData.endTime && formData.day && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                            📅 Vista previa de horarios a crear:
                        </h4>
                        <p className="text-blue-800 text-sm mb-3">
                            Se crearán {previewGeneratedSchedules().length} horarios de 1 hora cada uno para el {new Date(formData.day).toLocaleDateString('es-ES')}:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                            {previewGeneratedSchedules().map((schedule, index) => (
                                <div key={index} className="bg-white px-2 py-1 rounded border text-xs text-center">
                                    {schedule.start} - {schedule.end}
                                </div>
                            ))}
                        </div>
                        {previewGeneratedSchedules().length > 12 && (
                            <p className="text-xs text-blue-600 mt-2">
                                💡 Tip: Los usuarios podrán seleccionar los horarios específicos que necesiten
                            </p>
                        )}
                    </div>
                )}

                {/* Botones */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Agregando...</span>
                            </>
                        ) : (
                            <span>Agregar Horario</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddScheduleForm;