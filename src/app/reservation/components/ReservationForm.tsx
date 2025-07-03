// src/app/reservation/components/ReservationForm.tsx

import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../vehicle/hooks/useVehicle';
import { useSchedule } from '../../schedule/hooks/useSchedule';
import { useAuth } from '../../shared/hooks/useAuth';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { Schedule } from '../../schedule/types/schedule.types';
import type { Parking } from '../../parking/types/parking.types';

interface ReservationFormData {
    vehicleId: number;
    scheduleIds: number[]; // Cambiado a array para múltiples horarios
    reservationDate: string;
    selectedSchedules: Schedule[]; // Array de horarios seleccionados
}

interface ReservationFormProps {
    parking: Parking;
    onSubmit: (data: ReservationFormData) => void;
    onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ parking, onSubmit, onCancel }) => {
    const { user } = useAuth();
    const { vehicles, loading: vehiclesLoading, loadVehiclesForCurrentUser } = useVehicle();
    const { schedules, loading: schedulesLoading, loadAvailableSchedulesByParking } = useSchedule();

    const [formData, setFormData] = useState<ReservationFormData>({
        vehicleId: 0,
        scheduleIds: [], // Array vacío para múltiples horarios
        reservationDate: '',
        selectedSchedules: [] // Array de horarios seleccionados
    });

    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

    useEffect(() => {
        if (user) {
            loadVehiclesForCurrentUser();
        }
        if (parking.id) {
            loadAvailableSchedulesByParking(parking.id);
        }
    }, [user, parking.id, loadVehiclesForCurrentUser, loadAvailableSchedulesByParking]);

    // Calcular precio total basado en horarios seleccionados
    useEffect(() => {
        if (formData.selectedSchedules.length > 0) {
            let totalPrice = 0;
            formData.selectedSchedules.forEach(schedule => {
                const start = new Date(`2000-01-01T${schedule.startTime}`);
                const end = new Date(`2000-01-01T${schedule.endTime}`);
                const diffMs = end.getTime() - start.getTime();
                const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
                totalPrice += diffHours * parking.price;
            });
            setCalculatedPrice(totalPrice);
        } else {
            setCalculatedPrice(0);
        }
    }, [formData.selectedSchedules, parking.price]);

    const handleVehicleChange = (vehicleId: number) => {
        setFormData(prev => ({ ...prev, vehicleId }));
    };

    const handleScheduleToggle = (schedule: Schedule) => {
        setFormData(prev => {
            const isSelected = prev.selectedSchedules.find(s => s.id === schedule.id);
            
            if (isSelected) {
                // Deseleccionar horario
                const newSelectedSchedules = prev.selectedSchedules.filter(s => s.id !== schedule.id);
                return {
                    ...prev,
                    selectedSchedules: newSelectedSchedules,
                    scheduleIds: newSelectedSchedules.map(s => s.id),
                    reservationDate: newSelectedSchedules.length > 0 ? newSelectedSchedules[0].day : ''
                };
            } else {
                // Seleccionar horario
                // Verificar que el horario sea del mismo día que los ya seleccionados
                if (prev.selectedSchedules.length > 0 && prev.selectedSchedules[0].day !== schedule.day) {
                    alert('Solo puedes seleccionar horarios del mismo día');
                    return prev;
                }
                
                const newSelectedSchedules = [...prev.selectedSchedules, schedule];
                return {
                    ...prev,
                    selectedSchedules: newSelectedSchedules,
                    scheduleIds: newSelectedSchedules.map(s => s.id),
                    reservationDate: schedule.day
                };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.vehicleId) {
            alert('Por favor selecciona un vehículo');
            return;
        }

        if (formData.scheduleIds.length === 0) {
            alert('Por favor selecciona al menos un horario');
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
                        Selecciona Horarios Disponibles * (Puedes seleccionar múltiples horarios del mismo día)
                    </label>
                    
                    {/* Información sobre selección múltiple */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            💡 <strong>Selección múltiple:</strong> Haz clic en los horarios que desees reservar. 
                            Solo puedes seleccionar horarios del mismo día.
                        </p>
                    </div>
                    
                    {schedules.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">
                                No hay horarios disponibles para este estacionamiento.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Agrupar horarios por día */}
                            {Object.entries(
                                schedules.reduce((acc, schedule) => {
                                    const date = schedule.day;
                                    if (!acc[date]) acc[date] = [];
                                    acc[date].push(schedule);
                                    return acc;
                                }, {} as Record<string, Schedule[]>)
                            )
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([date, daySchedules]) => (
                                <div key={date} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        {formatDate(date)}
                                    </h4>
                                    <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {daySchedules
                                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                            .map(schedule => {
                                                const isSelected = formData.selectedSchedules.find(s => s.id === schedule.id);
                                                return (
                                                    <button
                                                        key={schedule.id}
                                                        type="button"
                                                        onClick={() => handleScheduleToggle(schedule)}
                                                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                                            isSelected
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                                        }`}
                                                    >
                                                        <div className="text-center">
                                                            <div>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</div>
                                                            <div className="text-xs mt-1 opacity-75">
                                                                S/ {parking.price}/h
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reservation Summary */}
                {formData.selectedSchedules.length > 0 && formData.vehicleId && (
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
                                    {formatDate(formData.reservationDate)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Horarios seleccionados:</span>
                                <span className="font-medium">
                                    {formData.selectedSchedules.length} horario{formData.selectedSchedules.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="border-t border-green-300 pt-2 mt-2">
                                <div className="space-y-1">
                                    {formData.selectedSchedules
                                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                        .map((schedule, index) => (
                                            <div key={schedule.id} className="flex justify-between text-xs">
                                                <span>
                                                    Horario {index + 1}: {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                </span>
                                                <span>S/ {parking.price}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="flex justify-between border-t border-green-300 pt-2 mt-2 font-bold">
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
                        disabled={!formData.vehicleId || formData.scheduleIds.length === 0}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirmar Reserva{formData.selectedSchedules.length > 1 ? 's' : ''} 
                        ({formData.selectedSchedules.length} horario{formData.selectedSchedules.length !== 1 ? 's' : ''})
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;