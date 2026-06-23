import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import { useReservation } from '../../reservation/hooks/useReservation';
import ParkingService from '../../parking/services/parkingService';
import ReservationForm from '../../reservation/components/ReservationForm';
import MultipleReservationResult from '../../reservation/components/MultipleReservationResult';
import type { Parking } from '../../parking/types/parking.types';
import type { Reservation, ReservationFormData } from '../../reservation/types/reservation.types';

export const ChatbotWidget: React.FC = () => {
    const navigate = useNavigate();
    const { createReservation } = useReservation();
    const [isOpen, setIsOpen] = useState(false);

    // Estados para la gestión de reservas a pantalla completa
    const [activeParking, setActiveParking] = useState<Parking | null>(null);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [loadingParking, setLoadingParking] = useState(false);
    const [createdReservations, setCreatedReservations] = useState<Reservation[]>([]);
    const [showReservationResult, setShowReservationResult] = useState(false);

    // Manejar evento de reserva iniciado en ChatWindow
    const handleReserve = async (parkingId: number) => {
        try {
            setLoadingParking(true);
            console.log(`🤖 ChatbotWidget fetching parking details for ID: ${parkingId}`);
            const parking = await ParkingService.getParkingById(parkingId);
            setActiveParking(parking);
            setShowReservationForm(true);
        } catch (error) {
            console.error('Error fetching parking details in ChatbotWidget:', error);
            alert('No se pudieron obtener los detalles del estacionamiento para la reserva.');
        } finally {
            setLoadingParking(false);
        }
    };

    // Confirmar envío de reserva
    const handleReservationSubmit = async (formData: ReservationFormData) => {
        if (!activeParking) return;
        try {
            console.log('📝 Submitting chatbot reservation from widget level:', formData);
            const newReservations = await createReservation(formData, activeParking);
            setCreatedReservations(Array.isArray(newReservations) ? newReservations : [newReservations]);
            setShowReservationForm(false);
            setShowReservationResult(true);
        } catch (error) {
            console.error('Error creating reservations from ChatbotWidget:', error);
            alert('Error al crear las reservaciones: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    };

    const handleViewReservations = () => {
        setShowReservationResult(false);
        setIsOpen(false);
        navigate('/my-reservations');
    };

    const handleCloseResult = () => {
        setShowReservationResult(false);
        setCreatedReservations([]);
        setActiveParking(null);
    };

    return (
        <>
            <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
                {/* Ventana del Chat */}
                {isOpen && (
                    <ChatWindow
                        onClose={() => setIsOpen(false)}
                        onReserve={handleReserve}
                    />
                )}

                {/* Botón Flotante Circular */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95 ${isOpen
                        ? 'bg-gray-750 hover:bg-gray-800 rotate-90'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    title={isOpen ? 'Cerrar chat' : 'Hablar con Asistente'}
                    aria-label="Abrir asistente de soporte"
                >
                    {isOpen ? (
                        // Ícono de cerrar (X)
                        <svg className="w-6 h-6 animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // Ícono de burbuja de diálogo
                        <svg className="w-6 h-6 animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Spinner de carga global */}
            {loadingParking && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-[9999]">
                    <div className="bg-white p-5 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2.5"></div>
                        <p className="text-sm text-gray-700 font-semibold">Cargando estacionamiento...</p>
                    </div>
                </div>
            )}

            {/* Modal de Formulario de Reserva a pantalla completa */}
            {showReservationForm && activeParking && (
                <div className="fixed inset-0 bg-black bg-opacity-55 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-150">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-900">Reservar desde Chatbot</h2>
                            <button
                                onClick={() => {
                                    setShowReservationForm(false);
                                    setActiveParking(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <ReservationForm
                                parking={activeParking}
                                onSubmit={handleReservationSubmit}
                                onCancel={() => {
                                    setShowReservationForm(false);
                                    setActiveParking(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de resultado de múltiples reservaciones */}
            {showReservationResult && createdReservations.length > 0 && (
                <div className="fixed inset-0 z-[9999]">
                    <MultipleReservationResult
                        reservations={createdReservations}
                        onClose={handleCloseResult}
                        onViewReservations={handleViewReservations}
                    />
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;

