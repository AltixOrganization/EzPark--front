import React, { useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;
    
    // Mostrar mensaje de éxito si existe
    useEffect(() => {
        if (message) {
            // Opcional: Mostrar un toast o alerta con el mensaje
            console.log(message);
        }
    }, [message]);
    
    return (
        <div className="min-h-screen flex flex-col">
            {message && (
                <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 p-3 bg-green-100 text-green-700 rounded-md border border-green-200 text-center max-w-md shadow-md">
                    {message}
                </div>
            )}
            <LoginForm />
        </div>
    );
};

export default LoginPage;