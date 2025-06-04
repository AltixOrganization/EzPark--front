import { apiService } from '../../shared/utils/api';
import type { SignInRequest, SignUpRequest, AuthenticatedUser, User } from '../types/auth.types';

export class AuthService {
    private static readonly TOKEN_KEY = 'ezpark_token';
    private static readonly USER_KEY = 'ezpark_user';

    static async signIn(credentials: SignInRequest): Promise<AuthenticatedUser> {
        try {
            console.log('📤 Enviando datos de login:', credentials);
            
            const response = await apiService.post<AuthenticatedUser>('/authentication/sign-in', {
                email: credentials.email,
                password: credentials.password
            });

            console.log('✅ Respuesta de login:', response);
            console.log('🔑 Token de autenticación:', response.token);

            // Store token and user data
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response));

            return response;
        } catch (error: any) {
            console.error('❌ Error en login:', error);
            console.error('📋 Detalles del error:', {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            throw new Error(error instanceof Error ? error.message : 'Error al iniciar sesión');
        }
    }

    static async signUp(userData: SignUpRequest): Promise<User> {
        try {
            // Validar que todos los campos requeridos estén presentes
            if (!userData.firstName || !userData.lastName || !userData.birthDate || !userData.email || !userData.password) {
                throw new Error('Todos los campos son requeridos');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Formato de email inválido');
            }

            // Validar longitud de contraseña
            if (userData.password.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            // Validar formato de contraseña (según el backend: mayúscula, minúscula, número)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
            if (!passwordRegex.test(userData.password)) {
                throw new Error('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
            }

            // Validar fecha de nacimiento
            const birthDate = new Date(userData.birthDate);
            const today = new Date();
            if (birthDate >= today) {
                throw new Error('La fecha de nacimiento debe ser anterior a hoy');
            }

            // Preparar datos exactamente como los espera el backend
            const dataToSend = {
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                birthDate: userData.birthDate, // Formato YYYY-MM-DD
                email: userData.email.trim().toLowerCase(),
                password: userData.password,
                roles: userData.roles || ['ROLE_GUEST']
            };
            
            console.log('📤 Enviando datos de registro:', dataToSend);
            console.log('🔍 Validación de datos:');
            console.log('  - firstName:', typeof dataToSend.firstName, ':', dataToSend.firstName);
            console.log('  - lastName:', typeof dataToSend.lastName, ':', dataToSend.lastName);
            console.log('  - birthDate:', typeof dataToSend.birthDate, ':', dataToSend.birthDate);
            console.log('  - email:', typeof dataToSend.email, ':', dataToSend.email);
            console.log('  - password length:', dataToSend.password.length);
            console.log('  - roles:', dataToSend.roles);
            
            const response = await apiService.post<User>('/authentication/sign-up', dataToSend);
            
            console.log('✅ Respuesta de registro exitoso:', response);
            
            return response;
        } catch (error: any) {
            console.error('❌ Error en registro:', error);
            console.error('📋 Detalles del error:', {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            
            // Intentar obtener más detalles del error del backend
            if (error.message.includes('Invalid parameter')) {
                throw new Error('Uno o más campos tienen un formato inválido. Verifica que:\n- Los nombres no contengan números\n- El email sea válido\n- La fecha de nacimiento sea anterior a hoy\n- La contraseña tenga al menos 8 caracteres con mayúscula, minúscula y número');
            }
            
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