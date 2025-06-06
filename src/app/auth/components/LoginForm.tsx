import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import carParkingLogo from '../../../assets/images/ezpark-logo.png';
import ezParkImage from '../../../../public/ezPark_1.png'; // Asegúrate de que la ruta sea correcta


const LoginForm = () => {
    const [email, setEmail] = useState('');  // Cambio: era 'username', ahora es 'email'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();  // Usar el hook de autenticación

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Usar el método login del contexto que ya maneja el AuthService
            const success = await login({ email, password });
            if (success) {
                navigate('/my-reservations');
            } else {
                setError('Credenciales inválidas. Por favor intenta de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error. Por favor intenta más tarde.');
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
                            src={ezParkImage}
                            alt="EzPark"
                            className="max-w-md"
                        />
                    </div>

                    {/* Right side - Form */}
                    <div className="w-1/2 flex flex-col justify-center p-6 pl-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">Iniciar sesión</h2>
                        <p className="text-sm text-gray-600 mb-4">Ingresa a tu cuenta para acceder a tus reservas</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                                    Email {/* Cambio: era 'Nombre de usuario', ahora es 'Email' */}
                                </label>
                                <input
                                    type="email"  // Cambio: era 'text', ahora es 'email'
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="tu@email.com"  // Añadido placeholder
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            {/* Espacio extra para equilibrar con el formulario de registro */}
                            <div className="pb-4"></div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </button>
                        </form>

                        <div className="mt-4 text-center max-w-md">
                            <p className="text-sm">
                                ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Registrarse</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;