import React from 'react';
import type { Message } from '../types/chatbot.types';

interface ChatMessageProps {
    message: Message;
    onActionClick?: (parkingId: number) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick }) => {
    const isUser = message.role === 'user';

    // Formatear la hora en formato HH:MM
    const formatTime = (date: Date) => {
        try {
            const d = new Date(date);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className={`flex flex-col mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-850 rounded-bl-none border border-gray-100'
                    }`}
            >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

                {/* Botón de acción de reserva */}
                {!isUser && message.action && message.action.type === 'OPEN_RESERVATION_MODAL' && (
                    <div className="mt-3 pt-2 border-t border-gray-350">
                        <button
                            type="button"
                            onClick={() => onActionClick?.(message.action!.parkingId)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{message.action.label || 'Reservar ahora'}</span>
                        </button>
                    </div>
                )}
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5 px-1.5">
                {formatTime(message.timestamp)}
            </span>
        </div>
    );
};

export default ChatMessage;
