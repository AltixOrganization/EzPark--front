import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../../auth/services/authService';
import type { AuthContextType, SignInRequest, SignUpRequest, AuthenticatedUser } from '../../auth/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = AuthService.getStoredUser();
        if (storedUser && AuthService.isAuthenticated()) {
            setUser(storedUser);
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

    const isAuthenticated = !!user && AuthService.isAuthenticated();

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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};