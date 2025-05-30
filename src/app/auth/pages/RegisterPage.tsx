import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* El formulario ocupará toda la pantalla */}
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;