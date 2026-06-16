import { apiService } from '../../shared/utils/api';
import type { ChatResponse } from '../types/chatbot.types';

export class ChatbotService {
    /**
     * Envía un mensaje al chatbot en el backend
     * @param sessionId Identificador de sesión para conservar el contexto de la conversación
     * @param message Mensaje enviado por el usuario
     */
    static async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
        return apiService.post<ChatResponse>('/api/chatbot', {
            sessionId,
            message
        });
    }
}

export default ChatbotService;
