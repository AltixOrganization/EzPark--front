import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./app/shared/context/AuthContext";
import GoogleMapComponent from "./app/public/pages/home/components/GoogleMapComponent.tsx";
import Header from "./app/public/components/header.tsx";
import UserGaragesList from "./app/EzPark/garages/components/UserGaragesList.tsx";
import PublishGarage from "./app/EzPark/garages/components/PublishGarage.tsx";
import LoginPage from "./app/auth/pages/LoginPage.tsx";
import RegisterPage from "./app/auth/pages/RegisterPage.tsx";
import ProtectedRoute from "./app/shared/components/ProtectedRoute.tsx";

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Routes>
                    {/* Rutas públicas */}
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />

                    {/* Ruta principal (mapa) - Visible para todos */}
                    <Route
                        path="/"
                        element={
                            <>
                                <Header />
                                <GoogleMapComponent />
                            </>
                        }
                    />

                    {/* Rutas protegidas - Requieren autenticación */}
                    <Route
                        path="/user-garages"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <UserGaragesList />
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
                                    <PublishGarage />
                                </ProtectedRoute>
                            </>
                        }
                    />
                    <Route
                        path="/my-reservations"
                        element={
                            <>
                                <Header />
                                <ProtectedRoute>
                                    <div className="flex flex-col items-center justify-center h-screen">
                                        <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>
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
                                    <div className="flex flex-col items-center justify-center h-screen">
                                        <h1 className="text-2xl font-bold mb-4">Solicitudes de Estacionamiento</h1>
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