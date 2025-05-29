import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header: React.FC = () => {
    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <Link to="/" className="title">
                    <h1 ><span>Ez</span>Park</h1>
                    </Link>

                </div>

                <div className="navigation">
                    <a className="nav-item">Mis reservas</a>
                    <Link to="/user-garages" className="nav-item">Garages</Link>
                    <a className="nav-item">Rentar Garage</a>
                    <a className="nav-item">Solicitudes</a>
                </div>
            </div>

            <div className="divider"></div>

        </header>
    );
};

export default Header;