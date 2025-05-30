import { jwtDecode } from 'jwt-decode';
import type { AuthenticatedUser } from '../types/auth.types';

interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
}

/**
 * Check if the token is expired
 * @param token JWT token
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

/**
 * Get user from localStorage
 */
export const getStoredUser = (): AuthenticatedUser | null => {
    try {
        const userStr = localStorage.getItem('ezpark_user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
    return localStorage.getItem('ezpark_token');
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;
    return !isTokenExpired(token);
};

/**
 * Extract user role from token
 */
export const getUserRole = (): string | null => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode<any>(token);
        return decoded.role || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Check if current user has specified role
 */
export const hasRole = (role: string): boolean => {
    const userRole = getUserRole();
    return userRole === role;
};