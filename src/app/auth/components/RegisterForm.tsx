import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import carParkingLogo from '../../../assets/images/ezpark-logo.png';

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validación específica para nombres (según el backend: ^[A-Z][a-zA-Z]*$)
    const validateName = (name: string, fieldName: string): string | null => {
        if (!name) return `${fieldName} es requerido`;
        if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
            return `${fieldName} debe empezar con mayúscula y contener solo letras (sin espacios)`;
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
            // Preparar datos para el backend
            const registrationData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                birthDate: formData.birthDate,
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                roles: ['ROLE_GUEST']
            };

            console.log('📤 Datos de registro a enviar:', registrationData);

            const success = await register(registrationData);

            if (success) {
                navigate('/login', { 
                    state: { 
                        message: '¡Registro exitoso! Por favor inicia sesión con tu email y contraseña.' 
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
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header with logo */}
            <div className="p-4 flex items-center">
                <div className="flex items-center">
                    <img src={carParkingLogo} alt="EzPark Logo" className="h-14 w-14" />
                    <span className="ml-2 font-bold text-2xl">
                        <span className="text-black">Ez</span>
                        <span className="text-blue-600">Park</span>
                    </span>
                </div>
            </div>
            
            {/* Línea gruesa */}
            <div className="border-b-4 border-blue-600"></div>

            {/* Main content area */}
            <div className="flex flex-1 justify-center py-2">
                <div className="flex max-w-6xl w-full scale-[1.25] origin-center transform-gpu">
                    {/* Left side - Image */}
                    <div className="w-1/2 flex items-center justify-end p-6 pr-8">
                        <img 
                            src="/src/assets/images/ezPark_1.png" 
                            alt="EzPark" 
                            className="max-w-md"
                        />
                    </div>

                    {/* Right side - Form */}
                    <div className="w-1/2 flex flex-col justify-center p-6 pl-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">Crear cuenta nueva</h2>
                        <p className="text-sm text-gray-600 mb-4">Ingresa a tu cuenta y empieza a reservar estacionamientos</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm whitespace-pre-line">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm text-gray-700 mb-1">
                                        Nombres
                                        <span className="text-xs text-gray-500 block">Debe empezar con mayúscula</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        placeholder="Juan"
                                        pattern="^[A-Z][a-zA-Z]*$"
                                        title="Debe empezar con mayúscula y contener solo letras"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">
                                        Apellidos
                                        <span className="text-xs text-gray-500 block">Debe empezar con mayúscula</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        placeholder="Perez"
                                        pattern="^[A-Z][a-zA-Z]*$"
                                        title="Debe empezar con mayúscula y contener solo letras"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="birthDate" className="block text-sm text-gray-700 mb-1">
                                    Fecha de nacimiento
                                </label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                                        Contraseña
                                        <span className="text-xs text-gray-500 block">8-30 caracteres, mayúscula, minúscula y número</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        minLength={8}
                                        maxLength={30}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">
                                        Repetir contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        minLength={8}
                                        maxLength={30}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Creando cuenta...' : 'Crear cuenta nueva'}
                            </button>
                        </form>

                        <div className="mt-4 text-center max-w-md">
                            <p className="text-sm">
                                ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;