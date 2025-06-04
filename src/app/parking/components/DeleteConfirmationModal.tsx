// src/app/parking/components/DeleteConfirmationModal.tsx

import React from 'react';
import type { Parking } from '../types/parking.types';

interface DeleteConfirmationModalProps {
    parking: Parking;
    onConfirm: () => void;
    onCancel: () => void;
    deleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    parking,
    onConfirm,
    onCancel,
    deleting = false
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-gray-900">
                            Eliminar estacionamiento
                        </h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition duration-200"
                        disabled={deleting}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-gray-700 mb-3">
                            ¿Estás seguro de que quieres eliminar este estacionamiento? Esta acción no se puede deshacer.
                        </p>
                        
                        {/* Información del estacionamiento */}
                        <div className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                                        {parking.location.district}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {parking.location.address}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>S/ {parking.price.toFixed(2)}/hora</span>
                                        <span>{parking.space} espacios</span>
                                        <span>{parking.width}×{parking.length}×{parking.height}m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consecuencias */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Al eliminar este estacionamiento:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Se cancelarán todas las reservas activas
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Se perderá todo el historial de reservas
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                No podrás recuperar esta información
                            </li>
                        </ul>
                    </div>

                    {/* Input de confirmación */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Para confirmar, escribe "<span className="font-semibold text-red-600">ELIMINAR</span>" en el campo de abajo:
                        </label>
                        <input
                            type="text"
                            placeholder="Escribe ELIMINAR para confirmar"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                            onChange={(e) => {
                                const confirmButton = document.getElementById('confirm-delete-button') as HTMLButtonElement;
                                if (confirmButton) {
                                    confirmButton.disabled = e.target.value !== 'ELIMINAR' || deleting;
                                }
                            }}
                            disabled={deleting}
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 font-medium"
                            disabled={deleting}
                        >
                            Cancelar
                        </button>
                        <button
                            id="confirm-delete-button"
                            onClick={onConfirm}
                            disabled={true} // Inicialmente deshabilitado hasta que escriban "ELIMINAR"
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                        >
                            {deleting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar estacionamiento'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;