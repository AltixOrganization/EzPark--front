import React, { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import EditProfileModal from '../components/EditProfileModal';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { profile, loading, error, hasProfile } = useProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando perfil..." />;
    }

    if (error && !hasProfile) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar perfil</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasProfile) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <div className="text-yellow-600 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-yellow-800 mb-2">Perfil no encontrado</h3>
                        <p className="text-yellow-600 mb-4">
                            Parece que tu perfil no está completo. Esto puede suceder si hay un problema con el registro.
                        </p>
                        <p className="text-sm text-yellow-600">
                            Contacta al soporte técnico si el problema persiste.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header del perfil */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Banner superior */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    
                    {/* Información del perfil */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex items-end space-x-6">
                            <div className="relative -mt-16">
                                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Información básica */}
                            <div className="flex-1 min-w-0 pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {profile.firstName} {profile.lastName}
                                        </h1>
                                        <p className="text-gray-600">{user?.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {calculateAge(profile.birthDate)} años
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Editar perfil</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalles del perfil */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información personal */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Información Personal
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nombre completo</label>
                                <p className="text-gray-900">{profile.firstName} {profile.lastName}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900">{user?.email}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha de nacimiento</label>
                                <p className="text-gray-900">{formatDate(profile.birthDate)}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Edad</label>
                                <p className="text-gray-900">{calculateAge(profile.birthDate)} años</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de la cuenta */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Información de la Cuenta
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">ID de usuario</label>
                                <p className="text-gray-900">#{user?.id}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Miembro desde</label>
                                <p className="text-gray-900">{formatDate(profile.createdAt)}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Última actualización</label>
                                <p className="text-gray-900">{formatDate(profile.updatedAt)}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado de la cuenta</label>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Activa
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas o información adicional */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Actividad en EzPark
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">0</p>
                            <p className="text-sm text-gray-600">Reservas realizadas</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">0</p>
                            <p className="text-sm text-gray-600">Garajes publicados</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">⭐</p>
                            <p className="text-sm text-gray-600">Calificación promedio</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            {isEditModalOpen && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProfilePage;