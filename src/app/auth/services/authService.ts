import { apiService } from '../../shared/utils/api';
import type { SignInRequest, SignUpRequest, AuthenticatedUser, User } from '../types/auth.types';

export class AuthService {
    private static readonly TOKEN_KEY = 'ezpark_token';
    private static readonly USER_KEY = 'ezpark_user';

    static async signIn(credentials: SignInRequest): Promise<AuthenticatedUser> {
        try {
            const response = await apiService.post<AuthenticatedUser>('/authentication/sign-in', credentials);

            // Store token and user data
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response));

            return response;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Error al iniciar sesión');
        }
    }

    static async signUp(userData: SignUpRequest): Promise<User> {
        try {
            const response = await apiService.post<User>('/authentication/sign-up', userData);
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