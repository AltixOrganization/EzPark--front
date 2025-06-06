import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import carParkingLogo from '../../../assets/images/ezpark-logo.png';
import ezParkImage from '../../../../public/ezPark_1.png'; // Asegúrate de que la ruta sea correcta
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Auto-capitalizar nombres mientras se escribe
        if (name === 'firstName' || name === 'lastName') {
            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            setFormData(prev => ({ ...prev, [name]: capitalizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Validación específica para nombres (según el backend: ^[A-Z][a-zA-Z]*$)
    const validateName = (name: string, fieldName: string): string | null => {
        if (!name) return `${fieldName} es requerido`;
        if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
            return `${fieldName} debe empezar con mayúscula y contener solo letras (sin espacios ni números)`;
        }
        return null;
    };

    const validateForm = (): string | null => {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return 'El formato del email es inválido';
        }

        // Validar nombres según las reglas del backend
        const firstNameError = validateName(formData.firstName, 'El nombre');
        if (firstNameError) return firstNameError;

        const lastNameError = validateName(formData.lastName, 'El apellido');
        if (lastNameError) return lastNameError;

        // Validar fecha de nacimiento
        if (!formData.birthDate) {
            return 'La fecha de nacimiento es requerida';
        }

        const today = new Date();
        const birthDate = new Date(formData.birthDate);
        if (birthDate >= today) {
            return 'La fecha de nacimiento debe ser anterior a hoy';
        }

        // Validar contraseña según las reglas del backend
        if (formData.password.length < 8 || formData.password.length > 30) {
            return 'La contraseña debe tener entre 8 y 30 caracteres';
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(formData.password)) {
            return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
        }

        // Validar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            return 'Las contraseñas no coinciden';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validar formulario
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            // Preparar datos para el backend - SIEMPRE con ambos roles
            const registrationData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                birthDate: formData.birthDate,
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                roles: ['ROLE_GUEST', 'ROLE_HOST'] // ✅ SIEMPRE ambos roles automáticamente
            };

            console.log('📤 Datos de registro a enviar:', registrationData);

            const success = await register(registrationData);

            if (success) {
                navigate('/login', {
                    state: {
                        message: '¡Registro exitoso! Ahora puedes buscar Y ofrecer estacionamientos. Inicia sesión con tu email y contraseña.'
                    }
                });
            } else {
                setError('El registro falló. Por favor intenta nuevamente.');
            }
        } catch (err: any) {
            console.error('❌ Error en registro:', err);
            setError(err.message || 'Ocurrió un error durante el registro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex">
                    {/* Left side - Image */}
                    <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="relative z-10 text-center text-white">
                            <img
                                src={ezParkImage} 
                                alt="EzPark"
                                className="w-72 h-auto mx-auto mb-6 drop-shadow-lg"
                            />
                            <h2 className="text-2xl font-bold mb-2">¡Únete a EzPark!</h2>
                            <p className="text-blue-100">Busca Y ofrece estacionamientos</p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                    </div>

                    {/* Right side - Form */}
                    <div className="w-full lg:w-3/5 p-8">
                        {/* Logo for mobile */}
                        <div className="lg:hidden flex items-center justify-center mb-6">
                            <img src={carParkingLogo} alt="EzPark Logo" className="h-10 w-10" />
                            <span className="ml-3 font-bold text-xl">
                                <span className="text-black">Ez</span>
                                <span className="text-blue-600">Park</span>
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Crear cuenta nueva</h1>
                            <p className="text-sm lg:text-base text-gray-600">
                                Únete a EzPark y disfruta de buscar Y ofrecer estacionamientos
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="ml-3 text-sm text-red-700 whitespace-pre-line">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            {/* Names */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombres
                                        <span className="text-xs text-gray-500 block">Solo letras</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Juan"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellidos
                                        <span className="text-xs text-gray-500 block">Solo letras</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Perez"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Birth Date */}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            {/* Passwords */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                        <span className="text-xs text-gray-500 block">8-30 chars, 1 mayús, 1 minús, 1 número</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Repetir contraseña
                                        <span className="text-xs text-gray-500 block">Debe ser la misma</span>
                                    
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium mt-6"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando cuenta...
                                    </div>
                                ) : (
                                    'Crear cuenta nueva'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;