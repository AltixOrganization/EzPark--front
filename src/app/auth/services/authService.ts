import { apiService } from '../../shared/utils/api';
import type { SignInRequest, SignUpRequest, AuthenticatedUser, User } from '../types/auth.types';

export class AuthService {
    private static readonly TOKEN_KEY = 'ezpark_token';
    private static readonly USER_KEY = 'ezpark_user';

    static async signIn(credentials: SignInRequest): Promise<AuthenticatedUser> {
        try {
            console.log('📤 Enviando datos de login:', credentials);
              const response = await apiService.post<AuthenticatedUser>('/api/auth/authentication/sign-in', {
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
            
            // Mapear errores específicos del backend
            if (error.message.includes('404') || error.message.includes('not found')) {
                throw new Error('Usuario no encontrado. Verifica tu email.');
            }
            if (error.message.includes('401') || error.message.includes('Invalid credentials')) {
                throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
            }
            if (error.message.includes('400')) {
                throw new Error('Datos inválidos. Verifica tu email y contraseña.');
            }
            
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    }

    static async signUp(userData: SignUpRequest): Promise<User> {
        try {
            console.log('📤 Validando datos antes de enviar...');
            
            // Validar que todos los campos requeridos estén presentes
            if (!userData.firstName || !userData.lastName || !userData.birthDate || !userData.email || !userData.password) {
                throw new Error('Todos los campos son requeridos');
            }

            // Validar formato de nombres (debe coincidir con el backend: ^[A-Z][a-zA-Z]*$)
            const nameRegex = /^[A-Z][a-zA-Z]*$/;
            if (!nameRegex.test(userData.firstName)) {
                throw new Error('El nombre debe empezar con mayúscula y contener solo letras (sin espacios)');
            }
            if (!nameRegex.test(userData.lastName)) {
                throw new Error('El apellido debe empezar con mayúscula y contener solo letras (sin espacios)');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Formato de email inválido');
            }

            // Validar contraseña según reglas del backend
            if (userData.password.length < 8 || userData.password.length > 30) {
                throw new Error('La contraseña debe tener entre 8 y 30 caracteres');
            }

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
            
            console.log('📤 Enviando datos de registro:', {
                ...dataToSend,
                password: '*'.repeat(dataToSend.password.length) // Ocultar password en logs
            });
            
            const response = await apiService.post<User>('/api/auth/authentication/sign-up', dataToSend);
            
            console.log('✅ Respuesta de registro exitoso:', response);
            
            return response;
        } catch (error: any) {
            console.error('❌ Error en registro:', error);
            
            // Mapear errores específicos del backend
            if (error.message.includes('409') || error.message.includes('already exists')) {
                throw new Error('El email ya está registrado. Usa otro email o inicia sesión.');
            }
            if (error.message.includes('400') || error.message.includes('Invalid parameter')) {
                throw new Error('Datos inválidos. Verifica que:\n• Los nombres solo contengan letras y empiecen con mayúscula\n• El email sea válido\n• La fecha de nacimiento sea anterior a hoy\n• La contraseña cumpla con los requisitos');
            }
            if (error.message.includes('ERR_IAM')) {
                throw new Error('Error en el sistema de autenticación. Intenta más tarde.');
            }
            
            throw new Error(error.message || 'Error al registrar usuario');
        }
    }

    static logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        console.log('👋 Usuario desconectado');
    }

    static getStoredUser(): AuthenticatedUser | null {
        try {
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error al obtener usuario almacenado:', error);
            return null;
        }
    }

    /**
     * Get user roles from stored user data
     */
    static getUserRoles(): string[] {
        try {
            const user = this.getStoredUser();
            // ✅ Ahora el backend devuelve roles en el objeto user
            return user?.roles || [];
        } catch (error) {
            console.error('Error al obtener roles del usuario:', error);
            return [];
        }
    }

    /**
     * Check if user has specific role
     */
    static hasRole(role: string): boolean {
        const roles = this.getUserRoles();
        return roles.includes(role);
    }

    /**
     * Check if user is admin
     */
    static isAdmin(): boolean {
        return this.hasRole('ROLE_ADMIN');
    }

    /**
     * Check if user is host
     */
    static isHost(): boolean {
        return this.hasRole('ROLE_HOST');
    }

    static getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getStoredUser();
        const isValid = !!(token && user);
        
        if (isValid) {
            console.log('✅ Usuario autenticado:', user?.email);
        } else {
            console.log('❌ Usuario no autenticado');
        }
        
        return isValid;
    }
}

export default AuthService;