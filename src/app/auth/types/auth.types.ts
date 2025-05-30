// Auth Types based on your backend API
export interface SignInRequest {
    username: string;
    password: string;
}

export interface SignUpRequest {
    email: string;
    username: string;
    password: string;
    roles?: string[];
}

export interface AuthenticatedUser {
    id: number;
    username: string;
    token: string;
}

export interface User {
    id: number;
    email: string;
    username: string;
    roles: string[];
}

export interface AuthResponse {
    success: boolean;
    user?: AuthenticatedUser;
    message?: string;
}

export interface AuthContextType {
    user: AuthenticatedUser | null;
    login: (credentials: SignInRequest) => Promise<boolean>;
    register: (userData: SignUpRequest) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}