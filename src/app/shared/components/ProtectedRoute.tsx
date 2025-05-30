import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * 
 * Este componente verifica si el usuario está autenticado.
 * Si no está autenticado, redirige al usuario a la página de login.
 * Si está autenticado, renderiza el contenido hijo normalmente.
 * 
 * @param children - El contenido a renderizar si el usuario está autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar spinner durante la verificación
    if (loading) {
        return <LoadingSpinner fullScreen text="Verificando autenticación..." />;
    }

    // Redirigir si no está autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Renderizar normalmente si está autenticado
    return <>{children}</>;
};

export default ProtectedRoute;