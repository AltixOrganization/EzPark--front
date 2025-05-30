import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import carParkingLogo from '../../../assets/images/ezpark-logo.png'; // Asegúrate de que la ruta sea correcta

const Header: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);

    // Oculta el dropdown al cambiar de ruta
    useEffect(() => {
        setShowDropdown(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Función para determinar si un enlace está activo
    const isActive = (path: string) => {
        return location.pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600";
    };

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo a la izquierda, igual que en el formulario de registro */}
                    <Link to="/" className="flex items-center">
                        <img src={carParkingLogo} alt="EzPark Logo" className="h-10 w-10" />
                        <span className="ml-2 font-bold text-xl">
                            <span className="text-black">Ez</span>
                            <span className="text-blue-600">Park</span>
                        </span>
                    </Link>

                    {/* Secciones de navegación a la derecha */}
                    {isAuthenticated ? (
                        <nav className="flex items-center space-x-8">
                            <Link to="/" className={`font-medium ${isActive('/')}`}>
                                Inicio
                            </Link>
                            <Link to="/my-reservations" className={`font-medium ${isActive('/my-reservations')}`}>
                                Mis Reservas
                            </Link>
                            <Link to="/user-garages" className={`font-medium ${isActive('/user-garages')}`}>
                                Mis Garajes
                            </Link>
                            <Link to="/publish-garage" className={`font-medium ${isActive('/publish-garage')}`}>
                                Publicar Garaje
                            </Link>
                            <Link to="/parking-requests" className={`font-medium ${isActive('/parking-requests')}`}>
                                Solicitudes
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

            {/* Ícono de perfil y cerrar sesión en la esquina inferior derecha */}
            {isAuthenticated && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                                    alt="Usuario" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="ml-2 mr-3">
                                <span className="block text-gray-700 text-sm font-medium">{user?.username || 'Usuario'}</span>
                            </div>
                            <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center mr-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                        </button>

                        {/* Dropdown para cerrar sesión */}
                        {showDropdown && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                <div className="px-4 py-2 text-xs text-gray-500">
                                    Sesión iniciada como
                                </div>
                                <div className="px-4 py-2 text-sm font-medium text-gray-700 truncate border-b border-gray-100">
                                    {user?.username || 'Usuario'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Barra de búsqueda debajo del header cuando estamos en la página de inicio */}
            {isAuthenticated && location.pathname === '/' && (
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
        </header>
    );
};

export default Header;