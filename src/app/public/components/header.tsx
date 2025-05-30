import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import './header.css';

const Header: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Función para determinar si un enlace está activo
    const isActive = (path: string) => {
        return location.pathname === path ? "nav-item active" : "nav-item";
    };

    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <Link to="/" className="title">
                        <h1><span>Ez</span>Park</h1>
                    </Link>
                </div>

                <div className="navigation">
                    {/* Enlaces siempre visibles */}
                    <Link to="/" className={isActive('/')}>Inicio</Link>

                    {isAuthenticated ? (
                        <>
                            {/* Enlaces para usuarios autenticados */}
                            <Link to="/my-reservations" className={isActive('/my-reservations')}>Mis Reservas</Link>
                            <Link to="/user-garages" className={isActive('/user-garages')}>Mis Garajes</Link>
                            <Link to="/publish-garage" className={isActive('/publish-garage')}>Publicar Garaje</Link>
                            <Link to="/parking-requests" className={isActive('/parking-requests')}>Solicitudes</Link>
                        </>
                    ) : (
                        <>
                            {/* Enlaces para usuarios no autenticados */}
                            <Link to="/login" className={isActive('/login')}>Iniciar Sesión</Link>
                            <Link to="/register" className={isActive('/register')}>Registrarse</Link>
                        </>
                    )}
                </div>

                {/* Información de usuario y botón de cierre de sesión */}
                {isAuthenticated && (
                    <div className="user-section">
                        <img className="user-img" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="usuario" />
                        <h1>{user?.username || 'Usuario'}</h1>
                        <button 
                            onClick={handleLogout} 
                            className="logout-button"
                            title="Cerrar sesión"
                        >
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png" 
                                alt="Cerrar sesión" 
                                style={{ width: "30px", height: "30px" }} 
                            />
                        </button>
                    </div>
                )}
            </div>

            <div className="divider"></div>
        </header>
    );
};

export default Header;