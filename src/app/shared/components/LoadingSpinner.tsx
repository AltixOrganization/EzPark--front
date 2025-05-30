import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    fullScreen = false,
    text = 'Loading...'
}) => {
    // Set spinner size based on prop
    const sizeClass = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-16 w-16'
    }[size];

    // Container class based on fullScreen prop
    const containerClass = fullScreen
        ? 'fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50'
        : 'flex flex-col justify-center items-center p-4';

    return (
        <div className={containerClass}>
            <div className={`${sizeClass} border-t-2 border-b-2 border-blue-500 rounded-full animate-spin`}></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;