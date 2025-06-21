import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import AuthService from '../../auth/services/authService';
import carParkingLogo from '../../../assets/images/ezpark-logo.png';
import UserProfile from '../../shared/components/UserProfile';

const Header: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Verificar si el usuario es admin
    const isAdmin = AuthService.isAdmin();

    // Función para determinar si un enlace está activo
    const isActive = (path: string) => {
        return location.pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600";
    };

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo a la izquierda - ahora redirige a /home si está autenticado */}
                    <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center">
                        <img src={carParkingLogo} alt="EzPark Logo" className="h-10 w-10" />
                        <span className="ml-2 font-bold text-xl">
                            <span className="text-black">Ez</span>
                            <span className="text-blue-600">Park</span>
                        </span>
                    </Link>                    {/* Secciones de navegación a la derecha */}
                    {isAuthenticated ? (
                        <nav className="flex items-center space-x-8">
                            <Link to="/home" className={`font-medium ${isActive('/home')}`}>
                                Mapa
                            </Link>
                            <Link to="/estacionamientos" className={`font-medium ${isActive('/estacionamientos')}`}>
                                Buscar Estacionamiento
                            </Link>                            <Link to="/my-reservations" className={`font-medium ${isActive('/my-reservations')}`}>
                                Mis Reservas
                            </Link>
                            <Link to="/payment-history" className={`font-medium ${isActive('/payment-history')}`}>
                                Pagos
                            </Link>
                            <Link to="/my-vehicles" className={`font-medium ${isActive('/my-vehicles')}`}>
                                Mis Vehículos
                            </Link>
                            <Link to="/user-garages" className={`font-medium ${isActive('/user-garages')}`}>
                                Garajes
                            </Link>
                            <Link to="/publish-garage" className={`font-medium ${isActive('/publish-garage')}`}>
                                Rentar garaje
                            </Link>
                            <Link to="/parking-requests" className={`font-medium ${isActive('/parking-requests')}`}>
                                Solicitudes
                            </Link>

                            {/* Mostrar enlace de Admin solo si es administrador */}
                            {isAdmin && (
                                <Link to="/admin" className={`font-medium ${isActive('/admin')} flex items-center text-red-600 hover:text-red-700`}>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Admin
                                </Link>
                            )}

                            <Link to="/profile" className={`font-medium ${isActive('/profile')} flex items-center`}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Mi Perfil
                            </Link>
                        </nav>
                    ) : (
                        <nav className="flex items-center space-x-6">
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Registrarse
                            </Link>
                        </nav>
                    )}
                </div>
            </div>

            {/* Barra de búsqueda debajo del header cuando estamos en la página de inicio */}
            {isAuthenticated && location.pathname === '/home' && (
                <div className="bg-white border-t border-gray-200 py-2 px-4 shadow-sm">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Encuentra tu garage"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Componente de perfil de usuario en la esquina inferior derecha */}
            {isAuthenticated && (
                <div className="fixed bottom-4 right-4 z-50">
                    <UserProfile />
                </div>
            )}
        </header>
    );
};

export default Header;