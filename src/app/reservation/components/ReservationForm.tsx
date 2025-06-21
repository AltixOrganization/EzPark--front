// src/app/reservation/components/ReservationForm.tsx

import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../vehicle/hooks/useVehicle';
import { useSchedule } from '../../schedule/hooks/useSchedule';
import { useAuth } from '../../shared/hooks/useAuth';
import ScheduleCard from '../../schedule/components/ScheduleCard';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Schedule } from '../../schedule/types/schedule.types';
import type { Parking } from '../../parking/types/parking.types';

interface ReservationFormData {
    vehicleId: number;
    scheduleId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
}

interface ReservationFormProps {
    parking: Parking;
    onSubmit: (data: ReservationFormData) => void;
    onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ parking, onSubmit, onCancel }) => {
    const { user } = useAuth();
    const { vehicles, loading: vehiclesLoading, loadVehiclesByUser } = useVehicle();
    const { schedules, loading: schedulesLoading, loadAvailableSchedulesByParking } = useSchedule();

    const [formData, setFormData] = useState<ReservationFormData>({
        vehicleId: 0,
        scheduleId: 0,
        reservationDate: '',
        startTime: '',
        endTime: ''
    });

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

    useEffect(() => {
        if (user) {
            loadVehiclesByUser(user.id);
        }
        if (parking.id) {
            loadAvailableSchedulesByParking(parking.id);
        }
    }, [user, parking.id, loadVehiclesByUser, loadAvailableSchedulesByParking]);

    useEffect(() => {
        if (selectedSchedule) {
            setFormData(prev => ({
                ...prev,
                scheduleId: selectedSchedule.id,
                reservationDate: selectedSchedule.day,
                startTime: selectedSchedule.startTime,
                endTime: selectedSchedule.endTime
            }));
            
            // Calculate price
            const start = new Date(`2000-01-01T${selectedSchedule.startTime}`);
            const end = new Date(`2000-01-01T${selectedSchedule.endTime}`);
            const diffMs = end.getTime() - start.getTime();
            const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
            setCalculatedPrice(diffHours * parking.price);
        }
    }, [selectedSchedule, parking.price]);

    const handleVehicleChange = (vehicleId: number) => {
        setFormData(prev => ({ ...prev, vehicleId }));
    };

    const handleScheduleSelect = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.vehicleId) {
            alert('Por favor selecciona un vehículo');
            return;
        }

        if (!formData.scheduleId) {
            alert('Por favor selecciona un horario');
            return;
        }

        onSubmit(formData);
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

    const formatTime = (timeString: string) => {
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (vehiclesLoading || schedulesLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Reservar Estacionamiento
            </h2>

            {/* Parking Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Estacionamiento Seleccionado</h3>
                <p className="text-blue-800">{parking.space}</p>
                <p className="text-blue-800">{parking.description}</p>
                <p className="text-blue-800 font-semibold">S/ {parking.price} por hora</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selecciona tu Vehículo *
                    </label>
                    {vehicles.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">
                                No tienes vehículos registrados. 
                                <a href="/my-vehicles" className="text-yellow-900 underline ml-1">
                                    Registra uno aquí
                                </a>
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {vehicles.map(vehicle => (
                                <div
                                    key={vehicle.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                        formData.vehicleId === vehicle.id
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleVehicleChange(vehicle.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {vehicle.licensePlate}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {vehicle.model?.brand?.name} {vehicle.model?.name}
                                            </p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            formData.vehicleId === vehicle.id
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {formData.vehicleId === vehicle.id && (
                                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Schedule Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selecciona un Horario Disponible *
                    </label>
                    {schedules.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">
                                No hay horarios disponibles para este estacionamiento.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {schedules.map(schedule => (
                                <ScheduleCard
                                    key={schedule.id}
                                    schedule={schedule}
                                    isSelectable={true}
                                    isSelected={selectedSchedule?.id === schedule.id}
                                    onSelect={handleScheduleSelect}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Reservation Summary */}
                {selectedSchedule && formData.vehicleId && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-3">Resumen de la Reserva</h3>
                        <div className="space-y-2 text-sm text-green-800">
                            <div className="flex justify-between">
                                <span>Vehículo:</span>
                                <span className="font-medium">
                                    {vehicles.find(v => v.id === formData.vehicleId)?.licensePlate}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Fecha:</span>
                                <span className="font-medium capitalize">
                                    {formatDate(selectedSchedule.day)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Horario:</span>
                                <span className="font-medium">
                                    {formatTime(selectedSchedule.startTime)} - {formatTime(selectedSchedule.endTime)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duración:</span>
                                <span className="font-medium">
                                    {(() => {
                                        const start = new Date(`2000-01-01T${selectedSchedule.startTime}`);
                                        const end = new Date(`2000-01-01T${selectedSchedule.endTime}`);
                                        const diffMs = end.getTime() - start.getTime();
                                        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
                                        return `${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
                                    })()}
                                </span>
                            </div>
                            <div className="flex justify-between text-base font-semibold pt-2 border-t border-green-300">
                                <span>Total a Pagar:</span>
                                <span>S/ {calculatedPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!formData.vehicleId || !formData.scheduleId}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;