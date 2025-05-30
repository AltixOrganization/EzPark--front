import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../../auth/types/auth.types';

/**
 * Custom hook to access authentication context throughout the application.
 * This hook provides access to all authentication related functions and state.
 *
 * @returns {AuthContextType} The authentication context containing user info and auth methods
 * @throws {Error} If used outside of an AuthProvider
 * 
 * @example
 * // Inside a component:
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * // Check if user is logged in
 * if (isAuthenticated) {
 *   // Do something with the authenticated user
 *   console.log(user.username);
 * }
 * 
 * // Login function usage
 * const handleLogin = async () => {
 *   const success = await login({ username: "user", password: "pass" });
 *   if (success) {
 *     // Navigate or perform actions after successful login
 *   }
 * };
 * 
 * // Logout function usage
 * const handleLogout = () => {
 *   logout();
 *   // Navigate or perform actions after logout
 * };
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};