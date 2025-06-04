import React, { useState, useEffect } from 'react';
import type { Profile, UpdateProfileRequest } from '../services/profileService';
import { useProfile } from '../hooks/useProfile';

interface EditProfileModalProps {
    profile: Profile;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose }) => {
    const { updateProfile, updating, error } = useProfile();
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthDate: profile.birthDate
    });
    const [localError, setLocalError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    // Reset form when profile changes
    useEffect(() => {
        setFormData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            birthDate: profile.birthDate
        });
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Auto-capitalizar nombres
        if (name === 'firstName' || name === 'lastName') {
            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setFormData(prev => ({ ...prev, [name]: capitalizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Limpiar errores cuando el usuario empiece a escribir
        setLocalError('');
        setSuccess(false);
    };

    const validateForm = (): string | null => {
        // Validar nombres
        const nameRegex = /^[A-Z][a-zA-Z]*$/;
        if (!nameRegex.test(formData.firstName)) {
            return 'El nombre debe empezar con mayúscula y contener solo letras (sin espacios)';
        }
        if (!nameRegex.test(formData.lastName)) {
            return 'El apellido debe empezar con mayúscula y contener solo letras (sin espacios)';
        }

        // Validar fecha de nacimiento
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        if (birthDate >= today) {
            return 'La fecha de nacimiento debe ser anterior a hoy';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setSuccess(false);

        // Validar formulario
        const validationError = validateForm();
        if (validationError) {
            setLocalError(validationError);
            return;
        }

        // Verificar si hay cambios
        const hasChanges = 
            formData.firstName !== profile.firstName ||
            formData.lastName !== profile.lastName ||
            formData.birthDate !== profile.birthDate;

        if (!hasChanges) {
            setLocalError('No hay cambios para guardar');
            return;
        }

        try {
            const success = await updateProfile(formData);
            if (success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500); // Cerrar después de mostrar el mensaje de éxito
            }
        } catch (err) {
            // El error ya se maneja en el hook useProfile
            console.error('Error al actualizar:', err);
        }
    };

    const displayError = localError || error;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Editar Perfil</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200"
                        disabled={updating}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Mensaje de éxito */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ¡Perfil actualizado exitosamente!
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {displayError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                                <span className="text-xs text-gray-500 block">Solo letras, sin espacios</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Juan"
                                pattern="^[A-Z][a-zA-Z]*$"
                                title="Solo letras, debe empezar con mayúscula"
                                required
                                disabled={updating}
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                                <span className="text-xs text-gray-500 block">Solo letras, sin espacios</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Pérez"
                                pattern="^[A-Z][a-zA-Z]*$"
                                title="Solo letras, debe empezar con mayúscula"
                                required
                                disabled={updating}
                            />
                        </div>

                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                max={new Date().toISOString().split('T')[0]}
                                required
                                disabled={updating}
                            />
                        </div>

                        {/* Información del email (no editable) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                                <span className="text-xs text-gray-500 block">No se puede modificar</span>
                            </label>
                            <input
                                type="email"
                                value={profile.userId ? `usuario-${profile.userId}@ezpark.com` : 'No disponible'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                disabled
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                                disabled={updating}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {updating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar cambios'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;