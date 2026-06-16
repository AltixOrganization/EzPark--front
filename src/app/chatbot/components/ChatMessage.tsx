import React from 'react';
import type { Message } from '../types/chatbot.types';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
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
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-850 rounded-bl-none border border-gray-100'
                }`}
            >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5 px-1.5">
                {formatTime(message.timestamp)}
            </span>
        </div>
    );
};

export default ChatMessage;
