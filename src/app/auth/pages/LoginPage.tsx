import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';
import { useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;
    
    return (
        <AuthLayout 
            title="Sign in to your account" 
            linkText="Don't have an account? Register"
            linkTo="/register"
        >
            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;