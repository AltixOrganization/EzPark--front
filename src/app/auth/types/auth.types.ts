// Auth Types based on your backend API
export interface SignInRequest {
    email: string;    // Cambio: era 'username', ahora es 'email'
    password: string;
}

export interface SignUpRequest {
    firstName: string;     // Nuevo: requerido por el backend
    lastName: string;      // Nuevo: requerido por el backend
    birthDate: string;     // Nuevo: requerido por el backend (formato YYYY-MM-DD)
    email: string;
    password: string;
    roles?: string[];
}

// El backend devuelve esta estructura para sign-in
export interface AuthenticatedUser {
    id: number;
    email: string;    // Cambio: era 'username', ahora es 'email'
    token: string;
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