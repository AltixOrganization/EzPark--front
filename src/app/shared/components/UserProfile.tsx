import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
    className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Email del usuario (podría venir del contexto de autenticación o ser un valor por defecto)
    const userEmail = user?.email || 'usuario@ezpark.com';

    // Nombre a mostrar (puede ser el username del usuario o un valor por defecto)
    const displayName = user?.username || 'Usuario';

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center bg-white rounded-full py-1 px-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow w-64" // Más ancho
            >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="Usuario"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="ml-2 flex-grow">
                    <span className="block text-gray-700 text-sm font-medium truncate">
                        {displayName}
                    </span>
                    <span className="block text-gray-500 text-xs truncate">
                        {userEmail}
                    </span>
                </div>
                <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
            </button>

            {/* Dropdown para cerrar sesión */}
            {showDropdown && (
                <div className="absolute bottom-full right-0 mb-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-xs text-gray-500">
                        Sesión iniciada como
                    </div>
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 truncate border-b border-gray-100">
                        {displayName}
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-500 truncate border-b border-gray-100">
                        {userEmail}
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
    );
};

export default UserProfile;