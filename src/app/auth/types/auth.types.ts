// Auth Types based on your backend API
export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    password: string;
    roles?: string[];
}

// El backend DEBE devolver esta estructura para sign-in (ACTUALIZADO)
export interface AuthenticatedUser {
    id: number;
    email: string;
    token: string;
    roles: string[]; // ✅ Ahora incluye roles
}

// El backend devuelve esta estructura para sign-up
export interface User {
    id: number;
    email: string;
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