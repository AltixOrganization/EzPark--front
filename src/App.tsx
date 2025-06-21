import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./app/shared/context/AuthContext";
import { GoogleMapsProvider } from "./app/shared/providers/GoogleMapsProvider";
import GoogleMapComponent from "./app/public/pages/home/components/GoogleMapComponent.tsx";
import Header from "./app/public/components/header.tsx";
import LoginPage from "./app/auth/pages/LoginPage.tsx";
import RegisterPage from "./app/auth/pages/RegisterPage.tsx";
import ProfilePage from "./app/profile/pages/ProfilePage.tsx";
import AdminPage from "./app/admin/page/AdminPage.tsx";
import ProtectedRoute from "./app/shared/components/ProtectedRoute.tsx";
import ProtectedAdminRoute from "./app/shared/components/ProtectedAdminRoute.tsx";
import AllParkingsPage from "./app/parking/pages/AllParkingsPage.tsx";
import CreateParkingPage from "./app/parking/pages/CreateParkingPage.tsx";
import MyParkingsPage from "./app/parking/pages/MyParkingsPage.tsx";
import MyVehiclesPage from "./app/vehicle/pages/MyVehiclesPage.tsx";
import AdminVehiclesPage from "./app/vehicle/pages/AdminVehiclesPage.tsx";
import MyReservationsPage from "./app/reservation/pages/MyReservationsPage.tsx";
import HostReservationsPage from "./app/reservation/pages/HostReservationsPage.tsx";
import PaymentHistoryPage from "./app/payment/pages/PaymentHistoryPage.tsx";
import PaymentPage from "./app/payment/pages/PaymentPage.tsx";
import ParkingSchedulePage from "./app/schedule/pages/ParkingSchedulePage.tsx";
import { useAuth } from "./app/shared/hooks/useAuth";

// Componente para manejar la redirección inicial
const InitialRedirect = () => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando sesión...</p>
                </div>
            </div>
        );
    }
    
    // Si está autenticado, ir al mapa; si no, ir al login
    return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
};

function App() {
    return (
        <AuthProvider>
            <GoogleMapsProvider>
                <div className="App min-h-screen bg-gray-50">
                    <Routes>
                        {/* Ruta raíz - redirige según el estado de autenticación */}
                        <Route path="/" element={<InitialRedirect />} />
                        
                        {/* Rutas de autenticación sin header */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Rutas protegidas con header */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <GoogleMapComponent />
                                </ProtectedRoute>
                            }
                        />
                        
                        <Route
                            path="/estacionamientos"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <AllParkingsPage />
                                </ProtectedRoute>
                            }
                        />
                        
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <ProtectedAdminRoute>
                                        <AdminPage />
                                    </ProtectedAdminRoute>
                                </ProtectedRoute>
                            }
                        />
                        
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Rutas de estacionamientos */}
                        <Route
                            path="/user-garages"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <MyParkingsPage />
                                </ProtectedRoute>
                            }
                        />
                          <Route
                            path="/publish-garage"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <CreateParkingPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Ruta para gestionar horarios de un estacionamiento */}
                        <Route
                            path="/parking/:parkingId/schedules"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <ParkingSchedulePage />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Rutas de vehículos */}
                        <Route
                            path="/my-vehicles"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <MyVehiclesPage />
                                </ProtectedRoute>
                            }
                        />
                        
                        <Route
                            path="/admin/vehicles"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <ProtectedAdminRoute>
                                        <AdminVehiclesPage />
                                    </ProtectedAdminRoute>
                                </ProtectedRoute>
                            }
                        />

                        {/* Otras rutas protegidas */}                        <Route
                            path="/my-reservations"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <MyReservationsPage />
                                </ProtectedRoute>
                            }
                        />
                          <Route
                            path="/parking-requests"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <HostReservationsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Ruta de pago para reservas */}
                        <Route
                            path="/payment"
                            element={
                                <ProtectedRoute>
                                    <PaymentPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Ruta de historial de pagos */}
                        <Route
                            path="/payment-history"
                            element={
                                <ProtectedRoute>
                                    <Header />
                                    <PaymentHistoryPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Ruta 404 - página no encontrada */}
                        <Route 
                            path="*" 
                            element={
                                <div className="min-h-screen flex items-center justify-center">
                                    <div className="text-center">
                                        <h1 className="text-4xl font-bold text-gray-700 mb-4">404</h1>
                                        <p className="text-gray-600 mb-4">Página no encontrada</p>
                                        <a href="/" className="text-blue-600 hover:underline">
                                            Volver al inicio
                                        </a>
                                    </div>
                                </div>
                            } 
                        />
                    </Routes>
                </div>
            </GoogleMapsProvider>
        </AuthProvider>
    );
}

export default App;