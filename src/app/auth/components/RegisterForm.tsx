import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import carParkingLogo from '../../../assets/images/ezpark-logo.png'; // Asegúrate de que la ruta sea correcta

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        nombres: '',
        apellidos: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setIsLoading(true);

        try {
            // Asignar automáticamente ambos roles: ROLE_GUEST y ROLE_HOST
            const success = await AuthService.signUp({
                email: formData.email,
                username: formData.nombres + ' ' + formData.apellidos, // Combinamos nombres y apellidos como username
                password: formData.password,
                roles: ['ROLE_GUEST', 'ROLE_HOST']
            });

            if (success) {
                // Redirect to login page after successful registration
                navigate('/login', { state: { message: '¡Registro exitoso! Por favor inicia sesión.' } });
            } else {
                setError('El registro falló. Por favor intenta nuevamente.');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error durante el registro');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header with logo */}
            <div className="p-4 flex items-center">
                <div className="flex items-center">
                    <img src={carParkingLogo} alt="EzPark Logo" className="h-14 w-14" /> {/* Logo exactamente 1.25x más grande */}
                    <span className="ml-2 font-bold text-2xl"> {/* Tamaño de texto adecuado */}
                        <span className="text-black">Ez</span>
                        <span className="text-blue-600">Park</span>
                    </span>
                </div>
            </div>
            
            {/* Línea gruesa */}
            <div className="border-b-4 border-blue-600"></div>

            {/* Main content area - takes full available height y CONTENIDO CENTRADO */}
            <div className="flex flex-1 justify-center py-2"> {/* Centrado horizontal */}
                <div className="flex max-w-6xl w-full scale-[1.25] origin-center transform-gpu"> {/* Escala exacta 1.25x */}
                    {/* Left side - Image */}
                    <div className="w-1/2 flex items-center justify-end p-6 pr-8"> {/* Ajuste de padding */}
                        <img 
                            src="/src/assets/images/ezPark_1.png" 
                            alt="EzPark" 
                            className="max-w-md" /* Tamaño adecuado para la escala */
                        />
                    </div>

                    {/* Right side - Form */}
                    <div className="w-1/2 flex flex-col justify-center p-6 pl-8"> {/* Ajuste de padding */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">Crear cuenta nueva</h2>
                        <p className="text-sm text-gray-600 mb-4">Ingresa a tu cuenta y empieza a reservar estacionamientos</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md"> {/* Adecuado para la escala */}
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
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nombres" className="block text-sm text-gray-700 mb-1">
                                        Nombres
                                    </label>
                                    <input
                                        type="text"
                                        id="nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="apellidos" className="block text-sm text-gray-700 mb-1">
                                        Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        id="apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
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
                                        required
                                    />
                                </div>
                            </div>

                            {/* Fake CAPTCHA - solo visual, sin funcionalidad
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" className="h-4 w-4" />
                                <span className="text-sm text-gray-700">I am not a robot</span>
                                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                                    <span className="text-blue-500">↻</span>
                                </div>
                            </div> */}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
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