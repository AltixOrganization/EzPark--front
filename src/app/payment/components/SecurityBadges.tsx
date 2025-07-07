// src/app/payment/components/SecurityBadges.tsx

import React from 'react';

interface SecurityBadgesProps {
    layout?: 'horizontal' | 'vertical';
    size?: 'sm' | 'md' | 'lg';
}

const SecurityBadges: React.FC<SecurityBadgesProps> = ({ 
    layout = 'horizontal',
    size = 'md'
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    badge: 'px-2 py-1 text-xs',
                    icon: 'w-3 h-3',
                    text: 'text-xs'
                };
            case 'lg':
                return {
                    badge: 'px-4 py-2 text-sm',
                    icon: 'w-5 h-5',
                    text: 'text-sm'
                };
            default:
                return {
                    badge: 'px-3 py-1.5 text-xs',
                    icon: 'w-4 h-4',
                    text: 'text-xs'
                };
        }
    };

    const sizeClasses = getSizeClasses();

    const badges = [
        {
            id: 'ssl',
            title: 'SSL Seguro',
            description: 'Conexión encriptada',
            icon: (
                <svg className={sizeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            color: 'green'
        },
        {
            id: 'pci',
            title: 'PCI DSS',
            description: 'Certificación de seguridad',
            icon: (
                <svg className={sizeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            color: 'blue'
        },
        {
            id: 'encrypt',
            title: '256-bit',
            description: 'Encriptación militar',
            icon: (
                <svg className={sizeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            ),
            color: 'purple'
        },
        {
            id: 'secure',
            title: 'Verificado',
            description: 'Pago 100% seguro',
            icon: (
                <svg className={sizeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            color: 'emerald'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            green: 'bg-green-100 text-green-700 border-green-200',
            blue: 'bg-blue-100 text-blue-700 border-blue-200',
            purple: 'bg-purple-100 text-purple-700 border-purple-200',
            emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
        return colors[color as keyof typeof colors] || colors.green;
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-gray-600">
                    Tu pago está protegido
                </span>
            </div>

            <div className={`
                flex justify-center items-center gap-3
                ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'}
            `}>
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`
                            flex items-center space-x-2 border rounded-full transition-all duration-200
                            hover:scale-105 cursor-default
                            ${sizeClasses.badge} ${getColorClasses(badge.color)}
                        `}
                        title={badge.description}
                    >
                        {badge.icon}
                        <span className={`font-medium ${sizeClasses.text}`}>
                            {badge.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Additional Security Info */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No almacenamos tu información de pago
                </p>
            </div>
        </div>
    );
};

export default SecurityBadges;
