import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../../auth/services/authService';
import type { AuthContextType, SignInRequest, SignUpRequest, AuthenticatedUser } from '../../auth/types/auth.types';
import { isTokenExpired } from '../../auth/utils/authUtils';

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in on component mount
        const storedUser = AuthService.getStoredUser();
        const token = AuthService.getToken();

        if (storedUser && token && !isTokenExpired(token)) {
            setUser(storedUser);
        } else if (token || storedUser) {
            // If token is expired but exists, clean up
            AuthService.logout();
        }

        setLoading(false);
    }, []);

    const login = async (credentials: SignInRequest): Promise<boolean> => {
        try {
            setLoading(true);
            const authenticatedUser = await AuthService.signIn(credentials);
            setUser(authenticatedUser);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: SignUpRequest): Promise<boolean> => {
        try {
            setLoading(true);
            await AuthService.signUp(userData);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const isAuthenticated = !!user && !!AuthService.getToken() && !isTokenExpired(AuthService.getToken() || '');

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the useAuth hook for easier consumption
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};