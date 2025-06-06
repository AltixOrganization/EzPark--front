import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * 
 * Este componente verifica si el usuario está autenticado.
 * Si no está autenticado, redirige al usuario a la página de login
 * y guarda la ubicación actual para redirigir después del login.
 * Si está autenticado, renderiza el contenido hijo normalmente.
 * 
 * @param children - El contenido a renderizar si el usuario está autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log('🛡️ ProtectedRoute: Verificando acceso a:', location.pathname, {
        isAuthenticated,
        loading
    });

    // Mostrar spinner durante la verificación
    if (loading) {
        return <LoadingSpinner fullScreen text="Verificando autenticación..." />;
    }

    // Redirigir si no está autenticado, guardando la ubicación actual
    if (!isAuthenticated) {
        console.log('🚫 ProtectedRoute: Usuario no autenticado, redirigiendo a login');
        console.log('💾 Guardando ubicación para redirección posterior:', location.pathname);
        
        return <Navigate 
            to="/login" 
            state={{ from: location }} 
            replace 
        />;
    }

    console.log('✅ ProtectedRoute: Usuario autenticado, permitiendo acceso');

    // Renderizar normalmente si está autenticado
    return <>{children}</>;
};

export default ProtectedRoute;