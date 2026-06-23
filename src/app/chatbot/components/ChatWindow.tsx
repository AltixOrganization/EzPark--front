import React, { useEffect, useRef } from 'react';
import useChatbot from '../hooks/useChatbot';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatWindowProps {
    onClose: () => void;
    onReserve: (parkingId: number) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, onReserve }) => {
    const { messages, isLoading, sendMessage, clearChat } = useChatbot();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll a la parte inferior de la ventana de chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Manejar clic en botón de acción de reserva
    const handleActionClick = (parkingId: number) => {
        console.log(`🤖 Chatbot message action click for parkingId: ${parkingId}`);
        onReserve(parkingId);
    };

    return (
        <div className="flex flex-col w-[380px] h-[500px] max-h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-left animate-fade-in-up">
            {/* Header del Chatbot */}
            <div className="flex justify-between items-center bg-blue-600 px-4 py-3.5 text-white">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-inner">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm leading-tight">Asistente EzPark</h3>
                        <span className="text-[10px] text-blue-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span> En línea
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Botón para reiniciar conversación */}
                    <button
                        onClick={clearChat}
                        title="Reiniciar conversación"
                        className="p-1.5 rounded-full hover:bg-blue-700 text-blue-100 hover:text-white transition-all focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                        </svg>
                    </button>
                    {/* Botón para cerrar la ventana */}
                    <button
                        onClick={onClose}
                        title="Cerrar chat"
                        className="p-1.5 rounded-full hover:bg-blue-700 text-blue-100 hover:text-white transition-all focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Listado de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col relative">
                <div className="flex-1">
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            onActionClick={handleActionClick}
                        />
                    ))}

                    {/* Indicador de escritura animado */}
                    {isLoading && (
                        <div className="flex flex-col items-start mb-3 animate-pulse">
                            <div className="flex items-center gap-1.5 bg-gray-200 border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensajes */}
            <ChatInput onSendMessage={sendMessage} isDisabled={isLoading} />
        </div>
    );
};

export default ChatWindow;

