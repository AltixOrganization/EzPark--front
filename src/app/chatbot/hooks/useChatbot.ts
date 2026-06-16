import { useState, useEffect } from 'react';
import ChatbotService from '../services/chatbotService';
import type { Message } from '../types/chatbot.types';

/**
 * Helper para generar UUID v4 nativo sin dependencias externas
 */
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const useChatbot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>('');

    // Inicializar el sessionId de manera persistente y agregar el saludo inicial
    useEffect(() => {
        let storedSessionId = localStorage.getItem('chatSessionId');
        if (!storedSessionId) {
            storedSessionId = generateUUID();
            localStorage.setItem('chatSessionId', storedSessionId);
        }
        setSessionId(storedSessionId);

        // Mensaje de bienvenida inicial
        setMessages([
            {
                id: 'welcome-msg',
                role: 'assistant',
                content: '¡Hola! Soy el asistente virtual de EzPark. ¿En qué puedo ayudarte hoy?',
                timestamp: new Date()
            }
        ]);
    }, []);

    /**
     * Envía un mensaje a la API y maneja el estado de carga y respuestas
     */
    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: text.trim(),
            timestamp: new Date()
        };

        // Añadir el mensaje de usuario a la UI de inmediato
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await ChatbotService.sendMessage(sessionId, text.trim());

            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                role: 'assistant',
                content: response.reply,
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error in chatbot communication:', error);
            
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: 'Lo siento, hubo un error. Intenta nuevamente.',
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Limpia la conversación y regenera el sessionId en el navegador
     */
    const clearChat = () => {
        const newSessionId = generateUUID();
        localStorage.setItem('chatSessionId', newSessionId);
        setSessionId(newSessionId);
        setMessages([
            {
                id: 'welcome-msg-reset',
                role: 'assistant',
                content: 'He reiniciado nuestra sesión de chat. ¿En qué te puedo ayudar hoy?',
                timestamp: new Date()
            }
        ]);
    };

    return {
        messages,
        isLoading,
        sendMessage,
        clearChat
    };
};

export default useChatbot;
