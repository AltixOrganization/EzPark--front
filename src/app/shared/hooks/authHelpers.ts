import { jwtDecode } from 'jwt-decode';
import type { AuthenticatedUser } from '../../auth/types/auth.types';

interface TokenPayload {
    sub: string; // subject (usually username)
    roles: string[]; // user roles
    exp: number; // expiration time
    iat: number; // issued at time
}

/**
 * Extract user roles from the JWT token
 * @returns {string[]} Array of user roles or empty array if token is invalid
 */
export const getUserRoles = (): string[] => {
    try {
        const token = localStorage.getItem('ezpark_token');
        if (!token) return [];

        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.roles || [];
    } catch (error) {
        console.error('Error decoding token:', error);
        return [];
    }
};

/**
 * Check if the current user has a specific role
 * @param {string} role - The role to check
 * @returns {boolean} True if user has the role, false otherwise
 */
export const hasRole = (role: string): boolean => {
    const roles = getUserRoles();
    return roles.includes(role);
};

/**
 * Check if the current user has any of the given roles
 * @param {string[]} requiredRoles - Array of roles to check
 * @returns {boolean} True if user has any of the roles, false otherwise
 */
export const hasAnyRole = (requiredRoles: string[]): boolean => {
    const userRoles = getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
};

/**
 * Get user ID from authenticated user
 * @returns {number | null} User ID or null if not available
 */
export const getUserId = (): number | null => {
    try {
        const userStr = localStorage.getItem('ezpark_user');
        if (!userStr) return null;

        const user = JSON.parse(userStr) as AuthenticatedUser;
        return user.id;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

/**
 * Format error message from API response
 * @param {any} error - Error object from API
 * @returns {string} Formatted error message
 */
export const formatAuthError = (error: any): string => {
    if (typeof error === 'string') return error;

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return 'An error occurred during authentication';
};

/**
 * Parse JWT token without validation
 * @param {string} token - JWT token
 * @returns {TokenPayload} Decoded token payload
 */
export const parseToken = (token: string): TokenPayload | null => {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
};