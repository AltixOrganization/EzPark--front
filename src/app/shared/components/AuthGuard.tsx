import React, { type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { hasAnyRole } from '../hooks/authHelpers';

interface AuthGuardProps {
    /**
     * The content to render if conditions are met
     */
    children: ReactNode;

    /**
     * If true, content will only be shown to authenticated users
     * If false, content will only be shown to unauthenticated users
     * Default is true
     */
    authenticated?: boolean;

    /**
     * Array of roles - if provided, user must have at least one of these roles
     */
    requiredRoles?: string[];

    /**
     * Optional fallback content to render when conditions are not met
     * If not provided, nothing will be rendered
     */
    fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on authentication status and/or user roles
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    authenticated = true,
    requiredRoles,
    fallback = null
}) => {
    const { isAuthenticated } = useAuth();

    // Handle authentication check
    const authConditionMet = authenticated === isAuthenticated;

    // Handle role check (only if authenticated and roles are required)
    let roleConditionMet = true;
    if (authenticated && isAuthenticated && requiredRoles && requiredRoles.length > 0) {
        roleConditionMet = hasAnyRole(requiredRoles);
    }

    // Render content only if all conditions are met
    if (authConditionMet && roleConditionMet) {
        return <>{children}</>;
    }

    // Otherwise render fallback
    return <>{fallback}</>;
};

export default AuthGuard;