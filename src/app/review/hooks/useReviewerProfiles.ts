// src/app/review/hooks/useReviewerProfiles.ts

import { useState, useEffect } from 'react';
import ProfileService, { type Profile } from '../../profile/services/profileService';
import type { Review } from '../types/review.types';

interface UseReviewerProfilesReturn {
    profiles: Map<number, Profile>;
    loading: boolean;
    error: string | null;
    getReviewerName: (profileId: number) => string;
}

export const useReviewerProfiles = (reviews: Review[]): UseReviewerProfilesReturn => {
    const [profiles, setProfiles] = useState<Map<number, Profile>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfiles = async () => {
            if (!reviews.length) {
                setProfiles(new Map());
                return;
            }

            // Obtener IDs únicos de perfiles que necesitamos cargar
            const profileIds = [...new Set(reviews.map(review => review.profileId))];
            const newProfiles = new Map<number, Profile>();

            try {
                setLoading(true);
                setError(null);

                // Cargar perfiles en paralelo
                const profilePromises = profileIds.map(async (profileId) => {
                    try {
                        const profile = await ProfileService.getProfileById(profileId);
                        return { profileId, profile };
                    } catch (error) {
                        console.warn(`No se pudo cargar perfil ${profileId}:`, error);
                        return { profileId, profile: null };
                    }
                });

                const results = await Promise.all(profilePromises);
                
                results.forEach(({ profileId, profile }) => {
                    if (profile) {
                        newProfiles.set(profileId, profile);
                    }
                });

                setProfiles(newProfiles);
            } catch (err) {
                console.error('Error al cargar perfiles de reviewers:', err);
                setError('Error al cargar información de usuarios');
            } finally {
                setLoading(false);
            }
        };

        loadProfiles();
    }, [reviews]);

    const getReviewerName = (profileId: number): string => {
        const profile = profiles.get(profileId);
        if (profile) {
            return `${profile.firstName} ${profile.lastName}`;
        }
        return `Usuario #${profileId}`;
    };

    return {
        profiles,
        loading,
        error,
        getReviewerName
    };
};

export default useReviewerProfiles;
