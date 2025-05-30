import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <AuthLayout 
            title="Create your account" 
            linkText="Already have an account? Sign in"
            linkTo="/login"
        >
            <RegisterForm />
        </AuthLayout>
    );
};

export default RegisterPage;