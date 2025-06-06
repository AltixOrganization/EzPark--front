import React, { useState, useEffect } from 'react';
import { apiService } from '../../shared/utils/api';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

interface User {
    id: number;
    email: string;
    roles: string[];
}

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'users' | 'profiles'>('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchProfiles();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            // Tu backend: GET /api/v1/users (requiere ROLE_ADMIN)
            const usersData = await apiService.get<User[]>('/api/v1/users');
            setUsers(usersData);
        } catch (err: any) {
            console.error('Error al cargar usuarios:', err);
            if (err.message.includes('403') || err.message.includes('Forbidden')) {
                setError('No tienes permisos para ver esta información. Solo administradores pueden acceder.');
            } else {
                setError('Error al cargar usuarios: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            setError('');
            // Tu backend: GET /profiles
            const profilesData = await apiService.get<Profile[]>('/profiles');
            setProfiles(profilesData);
        } catch (err: any) {
            console.error('Error al cargar perfiles:', err);
            setError('Error al cargar perfiles: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId: number) => {
        try {
            // Tu backend: GET /api/v1/users/{userId}
            const user = await apiService.get<User>(`/api/v1/users/${userId}`);
            setSelectedUser(user);
        } catch (err: any) {
            console.error('Error al cargar detalles del usuario:', err);
            setError('Error al cargar detalles del usuario: ' + err.message);
        }
    };

    const getRoleDisplayName = (roles: string[]) => {
        return roles.map(role => {
            switch (role) {
                case 'ROLE_GUEST': return 'Usuario';
                case 'ROLE_HOST': return 'Anfitrión';
                case 'ROLE_ADMIN': return 'Admin';
                default: return role.replace('ROLE_', '');
            }
        }).join(', ');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando panel de administración..." />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
                    <p className="text-gray-600">Gestiona usuarios y perfiles del sistema</p>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'users'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Usuarios ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('profiles')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'profiles'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Perfiles ({profiles.length})
                        </button>
                    </nav>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {activeTab === 'users' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de usuarios */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Lista de Usuarios
                                    </h3>
                                    <div className="space-y-3">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => fetchUserDetails(user.id)}
                                                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.email}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            ID: #{user.id}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((role) => (
                                                            <span
                                                                key={role}
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    role === 'ROLE_ADMIN'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : role === 'ROLE_HOST'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {getRoleDisplayName([role])}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detalles del usuario seleccionado */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Detalles del Usuario
                                    </h3>
                                    {selectedUser ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="text-gray-900">{selectedUser.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">ID</label>
                                                <p className="text-gray-900">#{selectedUser.id}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Roles</label>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedUser.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {getRoleDisplayName([role])}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            Selecciona un usuario para ver sus detalles
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Lista de perfiles */
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Lista de Perfiles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {profiles.map((profile) => (
                                    <div
                                        key={profile.id}
                                        className="p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {profile.firstName} {profile.lastName}
                                            </h4>
                                            <p className="text-sm text-gray-500">User ID: #{profile.userId}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Creado: {formatDate(profile.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;