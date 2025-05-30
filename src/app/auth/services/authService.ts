import { apiService } from '../../shared/utils/api';
import type { SignInRequest, SignUpRequest, AuthenticatedUser, User } from '../types/auth.types';

export class AuthService {
    private static readonly TOKEN_KEY = 'ezpark_token';
    private static readonly USER_KEY = 'ezpark_user';

    static async signIn(credentials: SignInRequest): Promise<AuthenticatedUser> {
        try {
            const response = await apiService.post<AuthenticatedUser>('/authentication/sign-in', credentials);

            // Imprimir el token en la consola
            console.log('🔑 Token de autenticación:', response.token);
            console.log('👤 Usuario autenticado:', response);

            // Store token and user data
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response));

            return response;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Error al iniciar sesión');
        }
    }

    // ...existing code...
    static async signUp(userData: SignUpRequest): Promise<User> {
        try {
            // Asegurar que el usuario siempre tenga ambos roles si no se especifican
            const dataToSend = {
                ...userData,
                roles: userData.roles || ['ROLE_GUEST', 'ROLE_HOST']
            };
            
            const response = await apiService.post<User>('/authentication/sign-up', dataToSend);
            return response;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Error al registrar usuario');
        }
    }

    static logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    static getStoredUser(): AuthenticatedUser | null {
        try {
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    }

    static getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getStoredUser();
        return !!(token && user);
    }
}

export default AuthService;