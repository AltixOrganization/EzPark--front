import { apiService } from '../../shared/utils/api';

export interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string; // Formato YYYY-MM-DD
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProfileRequest {
    firstName: string;
    lastName: string;
    birthDate: string;
    userId: number;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    birthDate: string;
}

export class ProfileService {
    private static readonly BASE_PATH = '/profiles';

    /**
     * Obtener perfil por ID
     */
    static async getProfileById(profileId: number): Promise<Profile> {
        try {
            console.log(`📤 Obteniendo perfil con ID: ${profileId}`);
            
            const response = await apiService.get<Profile>(`${this.BASE_PATH}/${profileId}`);
            
            console.log('✅ Perfil obtenido:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener perfil:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Perfil no encontrado');
            }
            
            throw new Error(error.message || 'Error al obtener el perfil');
        }
    }

    /**
     * Obtener todos los perfiles (solo para admin)
     */
    static async getAllProfiles(): Promise<Profile[]> {
        try {
            console.log('📤 Obteniendo todos los perfiles');
            
            const response = await apiService.get<Profile[]>(this.BASE_PATH);
            
            console.log('✅ Perfiles obtenidos:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener perfiles:', error);
            throw new Error(error.message || 'Error al obtener los perfiles');
        }
    }

    /**
     * Crear un nuevo perfil
     */
    static async createProfile(profileData: CreateProfileRequest): Promise<Profile> {
        try {
            console.log('📤 Creando perfil:', profileData);
            
            const response = await apiService.post<Profile>(this.BASE_PATH, profileData);
            
            console.log('✅ Perfil creado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al crear perfil:', error);
            
            if (error.message.includes('400')) {
                throw new Error('Datos del perfil inválidos. Verifica los campos.');
            }
            if (error.message.includes('404') && error.message.includes('User not found')) {
                throw new Error('Usuario no encontrado');
            }
            
            throw new Error(error.message || 'Error al crear el perfil');
        }
    }

    /**
     * Actualizar perfil existente
     */
    static async updateProfile(profileId: number, profileData: UpdateProfileRequest): Promise<Profile> {
        try {
            console.log(`📤 Actualizando perfil ${profileId}:`, profileData);
            
            const response = await apiService.put<Profile>(`${this.BASE_PATH}/${profileId}`, profileData);
            
            console.log('✅ Perfil actualizado:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Error al actualizar perfil:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Perfil no encontrado');
            }
            if (error.message.includes('400')) {
                throw new Error('Datos del perfil inválidos. Verifica los campos.');
            }
            
            throw new Error(error.message || 'Error al actualizar el perfil');
        }
    }

    /**
     * Eliminar perfil
     */
    static async deleteProfile(profileId: number): Promise<void> {
        try {
            console.log(`📤 Eliminando perfil con ID: ${profileId}`);
            
            await apiService.delete<void>(`${this.BASE_PATH}/delete/${profileId}`);
            
            console.log('✅ Perfil eliminado exitosamente');
        } catch (error: any) {
            console.error('❌ Error al eliminar perfil:', error);
            
            if (error.message.includes('404')) {
                throw new Error('Perfil no encontrado');
            }
            
            throw new Error(error.message || 'Error al eliminar el perfil');
        }
    }

    /**
     * Obtener perfil del usuario actual
     * Asume que el profileId es igual al userId
     */
    static async getCurrentUserProfile(): Promise<Profile | null> {
        try {
            // Obtener el usuario actual del localStorage
            const userStr = localStorage.getItem('ezpark_user');
            if (!userStr) {
                throw new Error('Usuario no autenticado');
            }

            const user = JSON.parse(userStr);
            const userId = user.id;

            console.log(`📤 Obteniendo perfil del usuario actual (ID: ${userId})`);
            
            // Según tu backend, el profileId parece ser igual al userId
            return await this.getProfileById(userId);
        } catch (error: any) {
            console.error('❌ Error al obtener perfil del usuario actual:', error);
            
            if (error.message.includes('404') || error.message.includes('not found')) {
                // El usuario no tiene perfil creado aún
                return null;
            }
            
            throw error;
        }
    }

    /**
     * Validar datos del perfil
     */
    static validateProfileData(profileData: Partial<UpdateProfileRequest>): string[] {
        const errors: string[] = [];

        // Validar nombre
        if (profileData.firstName) {
            if (!/^[A-Z][a-zA-Z]*$/.test(profileData.firstName)) {
                errors.push('El nombre debe empezar con mayúscula y contener solo letras');
            }
        }

        // Validar apellido
        if (profileData.lastName) {
            if (!/^[A-Z][a-zA-Z]*$/.test(profileData.lastName)) {
                errors.push('El apellido debe empezar con mayúscula y contener solo letras');
            }
        }

        // Validar fecha de nacimiento
        if (profileData.birthDate) {
            const birthDate = new Date(profileData.birthDate);
            const today = new Date();
            if (birthDate >= today) {
                errors.push('La fecha de nacimiento debe ser anterior a hoy');
            }
        }

        return errors;
    }
}

export default ProfileService;