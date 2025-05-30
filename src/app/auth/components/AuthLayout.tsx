import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    linkText: string;
    linkTo: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, linkText, linkTo }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <Link to="/">
                        <h1 className="text-center text-4xl font-bold">
                            <span className="text-black">Ez</span>
                            <span className="text-blue-600">Park</span>
                        </h1>
                    </Link>
                    <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                </div>
                <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    {children}
                </div>
                <div className="text-center mt-4">
                    <Link to={linkTo} className="font-medium text-blue-600 hover:text-blue-500">
                        {linkText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;