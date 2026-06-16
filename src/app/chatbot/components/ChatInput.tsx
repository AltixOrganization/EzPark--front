import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    isDisabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isDisabled) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 p-3 bg-white">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isDisabled}
                placeholder={isDisabled ? 'Esperando respuesta...' : 'Pregúntame sobre estacionamientos...'}
                className="flex-1 text-sm bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={!text.trim() || isDisabled}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full p-2.5 flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Enviar mensaje"
            >
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </button>
        </form>
    );
};

export default ChatInput;
