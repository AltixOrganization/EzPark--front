export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatRequest {
    sessionId: string;
    message: string;
}

export interface ChatResponse {
    reply: string;
}
