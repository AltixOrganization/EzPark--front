import { useState, useEffect } from 'react';
import ProfileService, { type Profile, type UpdateProfileRequest } from '../services/profileService';
import { useAuth } from '../../shared/hooks/useAuth';

interface UseProfileReturn {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    updating: boolean;
    updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
    refreshProfile: () => Promise<void>;
    hasProfile: boolean;
}

export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();

    const loadProfile = async () => {
        if (!isAuthenticated || !user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const userProfile = await ProfileService.getCurrentUserProfile();
            setProfile(userProfile);
        } catch (err: any) {
            console.error('Error al cargar perfil:', err);
            setError(err.message || 'Error al cargar el perfil');
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: UpdateProfileRequest): Promise<boolean> => {
        if (!profile) {
            setError('No hay perfil para actualizar');
            return false;
        }

        try {
            setUpdating(true);
            setError(null);

            // Validar datos antes de enviar
            const validationErrors = ProfileService.validateProfileData(data);
            if (validationErrors.length > 0) {
                setError(validationErrors.join('. '));
                return false;
            }

            const updatedProfile = await ProfileService.updateProfile(profile.id, data);
            setProfile(updatedProfile);
            
            console.log('✅ Perfil actualizado exitosamente');
            return true;
        } catch (err: any) {
            console.error('Error al actualizar perfil:', err);
            setError(err.message || 'Error al actualizar el perfil');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const refreshProfile = async () => {
        await loadProfile();
    };

    // Cargar perfil cuando el componente se monta o cuando cambia la autenticación
    useEffect(() => {
        loadProfile();
    }, [isAuthenticated, user]);

    return {
        profile,
        loading,
        error,
        updating,
        updateProfile,
        refreshProfile,
        hasProfile: !!profile
    };
};

export default useProfile;