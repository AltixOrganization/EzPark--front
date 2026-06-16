import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

export const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
            {/* Ventana del Chat */}
            {isOpen && (
                <ChatWindow onClose={() => setIsOpen(false)} />
            )}

            {/* Botón Flotante Circular */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isOpen 
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
    );
};

export default ChatbotWidget;
