// src/app/parking/components/schedule/ScheduleManager.tsx

import React, { useState, useEffect } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import ScheduleList from './ScheduleList';
import AddScheduleForm from './AddScheduleForm';
import type { Schedule, ScheduleFormData, CreateScheduleRequest } from '../../types/schedule.types';

interface ScheduleManagerProps {
    parkingId: number;
    parkingName?: string;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({
    parkingId,
    parkingName = "este estacionamiento"
}) => {
    const {
        schedules,
        loading,
        creating,
        error,
        loadAllSchedules,
        createSchedule,
        clearError,
        getSchedulesByParking
    } = useSchedule();

    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);

    useEffect(() => {
        loadAllSchedules();
    }, []);

    // Obtener horarios específicos del estacionamiento
    const parkingSchedules = getSchedulesByParking(parkingId);

    const handleAddSchedule = async (formData: ScheduleFormData) => {
        const scheduleRequest: CreateScheduleRequest = {
            parkingId,
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime
        };

        const success = await createSchedule(scheduleRequest);
        if (success) {
            setShowAddForm(false);
        }
    };

    const handleDeleteSchedule = (schedule: Schedule) => {
        setDeletingSchedule(schedule);
    };

    const confirmDelete = () => {
        // TODO: Implementar eliminación cuando esté disponible en el backend
        console.log('Eliminar horario:', deletingSchedule);
        setDeletingSchedule(null);
        alert('Función de eliminación próximamente disponible');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Horarios de Disponibilidad
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Gestiona los horarios de {parkingName}
                    </p>
                </div>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{showAddForm ? 'Cancelar' : 'Agregar Horario'}</span>
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Schedule Form */}
            {showAddForm && (
                <AddScheduleForm
                    parkingId={parkingId}
                    onSubmit={handleAddSchedule}
                    onCancel={() => setShowAddForm(false)}
                    loading={creating}
                />
            )}

            {/* Schedules List */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ScheduleList
                    schedules={parkingSchedules}
                    onDeleteSchedule={handleDeleteSchedule}
                    loading={loading}
                    emptyMessage="No hay horarios configurados para este estacionamiento. Agrega el primer horario para hacerlo disponible."
                />
            </div>

            {/* Statistics */}
            {parkingSchedules.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Resumen</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-lg font-bold text-blue-600">{parkingSchedules.length}</p>
                            <p className="text-xs text-blue-700">Total horarios</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-green-600">
                                {parkingSchedules.filter(s => s.isAvailable).length}
                            </p>
                            <p className="text-xs text-green-700">Disponibles</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-red-600">
                                {parkingSchedules.filter(s => !s.isAvailable).length}
                            </p>
                            <p className="text-xs text-red-700">Ocupados</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                ¿Eliminar horario?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro de que quieres eliminar este horario? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeletingSchedule(null)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleManager;
