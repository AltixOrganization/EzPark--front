export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    action?: {
        type: 'OPEN_RESERVATION_MODAL';
        parkingId: number;
        label: string;
    };
}

export interface ChatRequest {
    sessionId: string;
    message: string;
}

export interface ChatResponse {
    reply: string;
    action?: {
        type: 'OPEN_RESERVATION_MODAL';
        parkingId: number;
        label: string;
    };
}
