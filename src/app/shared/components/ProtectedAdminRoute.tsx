import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../../auth/services/authService';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedAdminRoute component
 * 
 * Este componente verifica si el usuario está autenticado Y tiene rol de administrador.
 * Si no está autenticado, redirige al login.
 * Si está autenticado pero no es admin, muestra mensaje de acceso denegado.
 * Si es admin, renderiza el contenido hijo.
 */
const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar spinner durante la verificación
    if (loading) {
        return <LoadingSpinner fullScreen text="Verificando permisos de administrador..." />;
    }

    // Redirigir si no está autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar si es administrador
    const isAdmin = AuthService.isAdmin();
    
    if (!isAdmin) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-md mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-red-800 mb-2">Acceso Denegado</h3>
                        <p className="text-red-600 mb-4">
                            No tienes permisos para acceder a esta sección. 
                            Solo los administradores pueden ver esta página.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar normalmente si es admin
    return <>{children}</>;
};

export default ProtectedAdminRoute;