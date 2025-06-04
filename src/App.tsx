import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./app/shared/context/AuthContext";
import GoogleMapComponent from "./app/public/pages/home/components/GoogleMapComponent.tsx";
import Header from "./app/public/components/header.tsx";
import LoginPage from "./app/auth/pages/LoginPage.tsx";
import RegisterPage from "./app/auth/pages/RegisterPage.tsx";
import ProfilePage from "./app/profile/pages/ProfilePage.tsx";
import AdminPage from "./app/admin/page/AdminPage.tsx";
import ProtectedRoute from "./app/shared/components/ProtectedRoute.tsx";
import ProtectedAdminRoute from "./app/shared/components/ProtectedAdminRoute.tsx";

// Importar los nuevos componentes de parking
import CreateParkingPage from "./app/parking/pages/CreateParkingPage.tsx";
import MyParkingsPage from "./app/parking/pages/MyParkingsPage.tsx";

function App() {
    return (
        <AuthProvider>
            <div className="App min-h-screen bg-gray-50">
                <Routes>
                    {/* Rutas de autenticación sin header */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Rutas con header */}
                    <Route
                        path="/"
                        element={
                            <>
                                <Header />
                                <GoogleMapComponent />
                            </>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <>
                                <Header />
                                <ProtectedAdminRoute>
                                    <AdminPage />
                                </ProtectedAdminRoute>
                            </>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            </>
                        }
                    />
                    
                    {/* Rutas de estacionamientos - ACTUALIZADAS */}
                    <Route
                        path="/user-garages"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <MyParkingsPage />
                                </ProtectedRoute>
                            </>
                        }
                    />
                    <Route
                        path="/publish-garage"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <CreateParkingPage />
                                </ProtectedRoute>
                            </>
                        }
                    />
                    
                    {/* Otras rutas existentes */}
                    <Route
                        path="/my-reservations"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <div className="container mx-auto py-8 px-4">
                                        <h1 className="text-2xl font-bold mb-6">Mis Reservas</h1>
                                        <p className="text-gray-600">Aquí aparecerán tus reservas de estacionamiento.</p>
                                    </div>
                                </ProtectedRoute>
                            </>
                        }
                    />
                    <Route
                        path="/parking-requests"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <div className="container mx-auto py-8 px-4">
                                        <h1 className="text-2xl font-bold mb-6">Solicitudes de Estacionamiento</h1>
                                        <p className="text-gray-600">Aquí aparecerán las solicitudes para tus espacios de estacionamiento.</p>
                                    </div>
                                </ProtectedRoute>
                            </>
                        }
                    />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;