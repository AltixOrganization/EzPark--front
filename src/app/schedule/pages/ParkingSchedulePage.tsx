// src/app/schedule/pages/ParkingSchedulePage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSchedule } from '../hooks/useSchedule';
import ScheduleList from '../components/ScheduleList';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const ParkingSchedulePage: React.FC = () => {
    const { parkingId } = useParams<{ parkingId: string }>();
    const {
        schedules,
        loading,
        error,
        loadSchedulesByParking,
        // deleteSchedule // Comentado temporalmente
    } = useSchedule();

    const [parkingInfo, setParkingInfo] = useState<{
        space: string;
        description: string;
        price: number;
    } | null>(null);

    useEffect(() => {
        if (parkingId) {
            const id = parseInt(parkingId);
            loadSchedulesByParking(id);

            // TODO: Load parking info from parking service
            // For now, using mock data
            setParkingInfo({
                space: `Estacionamiento #${id}`,
                description: 'Información del estacionamiento',
                price: 5.0
            });
        }
    }, [parkingId, loadSchedulesByParking]);

    const handleScheduleUpdate = () => {
        if (parkingId) {
            loadSchedulesByParking(parseInt(parkingId));
        }
    };

    // Función para eliminar un horario
    // const handleDeleteSchedule = async (scheduleId: number) => {
    //     try {
    //         await deleteSchedule(scheduleId);
    //         handleScheduleUpdate();
    //     } catch (error) {
    //         console.error('Error deleting schedule:', error);
    //         alert('Error al eliminar horario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    //     }
    // };

    if (!parkingId) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">ID de estacionamiento no válido</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Volver"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Horarios del Estacionamiento
                        </h1>
                        {parkingInfo && (
                            <p className="text-gray-600 mt-1">
                                {parkingInfo.space} - S/ {parkingInfo.price}/hora
                            </p>
                        )}
                    </div>
                </div>

                {parkingInfo && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">Información del Estacionamiento</h3>
                        <p className="text-blue-800 text-sm">{parkingInfo.description}</p>
                        <p className="text-blue-800 text-sm mt-1">
                            <strong>Tarifa:</strong> S/ {parkingInfo.price} por hora
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Instructions */}
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-900 mb-2">ℹ️ Gestión de Horarios</h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Crea horarios para indicar cuándo está disponible tu estacionamiento</li>
                    <li>• Cada horario representa un día específico y un rango de horas</li>
                    <li>• Los horarios disponibles pueden ser reservados por otros usuarios</li>
                    <li>• Los horarios se marcan automáticamente como "no disponibles" cuando se realizan reservas</li>
                </ul>
            </div>

            {/* Schedule List */}
            <ScheduleList
                schedules={schedules}
                title={`Horarios (${schedules.length})`}
                parkingId={parseInt(parkingId)}
                allowEdit={true}
                allowDelete={true}
                allowCreate={true}
                onScheduleUpdate={handleScheduleUpdate}
            />
        </div>
    );
};

export default ParkingSchedulePage;
