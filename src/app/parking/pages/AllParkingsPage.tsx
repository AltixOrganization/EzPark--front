// src/app/parking/pages/AllParkingsPage.tsx

import React, { useEffect, useState } from 'react';
import { useParking } from '../hooks/useParking';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import ParkingCard from '../components/ParkingCard';
import ParkingDetailsModal from '../components/ParkingDetailsModal'; // Nota: typo en el nombre del archivo
import type { Parking } from '../types/parking.types';

const AllParkingsPage: React.FC = () => {
    const { 
        parkings, 
        loading, 
        error, 
        loadAllParkings,
        //searchNearbyParkings 
    } = useParking();

    // Estados para filtros y búsqueda
    const [searchLocation, setSearchLocation] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'distance' | 'recent'>('recent');
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(50);

    // Estados para modales
    const [viewingParking, setViewingParking] = useState<Parking | null>(null);

    useEffect(() => {
        loadAllParkings();
    }, []);

    // Handlers
    const handleViewParking = (parking: Parking) => {
        setViewingParking(parking);
    };

    const handleReserveParking = (parking: Parking) => {
        // TODO: Implementar funcionalidad de reserva
        alert(`¡Funcionalidad de reserva para ${parking.location.district} próximamente!`);
    };

    const handleSearchLocation = () => {
        // TODO: Implementar búsqueda por ubicación
        alert(`Búsqueda por "${searchLocation}" próximamente!`);
    };

    // Filtrar y ordenar estacionamientos
    const filteredAndSortedParkings = React.useMemo(() => {
        let filtered = [...parkings];

        // Aplicar filtro de precio
        if (priceFilter !== 'all') {
            switch (priceFilter) {
                case 'low':
                    filtered = filtered.filter(p => p.price <= 10);
                    break;
                case 'medium':
                    filtered = filtered.filter(p => p.price > 10 && p.price <= 25);
                    break;
                case 'high':
                    filtered = filtered.filter(p => p.price > 25);
                    break;
            }
        }

        // Aplicar filtro de rango de precio
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // Solo mostrar estacionamientos con espacios disponibles
        filtered = filtered.filter(p => p.space > 0);

        // Aplicar ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'distance':
                    // TODO: Implementar ordenamiento por distancia
                    return 0;
                case 'recent':
                default:
                    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
            }
        });

        return filtered;
    }, [parkings, priceFilter, sortBy, minPrice, maxPrice]);

    // Estadísticas de la búsqueda
    const searchStats = {
        total: parkings.length,
        available: parkings.filter(p => p.space > 0).length,
        filtered: filteredAndSortedParkings.length,
        avgPrice: filteredAndSortedParkings.length > 0 
            ? (filteredAndSortedParkings.reduce((sum, p) => sum + p.price, 0) / filteredAndSortedParkings.length).toFixed(2)
            : '0.00'
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando estacionamientos disponibles..." />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Encuentra tu Estacionamiento
                    </h1>
                    <p className="text-gray-600">
                        Descubre espacios de estacionamiento disponibles cerca de ti
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Barra de búsqueda y filtros */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    {/* Búsqueda por ubicación */}
                    <div className="mb-6">
                        <label htmlFor="search-location" className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por ubicación
                        </label>
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                id="search-location"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                placeholder="Ej: Miraflores, San Isidro, Lima Centro..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleSearchLocation}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Buscar</span>
                            </button>
                        </div>
                    </div>

                    {/* Filtros y ordenamiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Filtro de precio categórico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rango de precio</label>
                            <select 
                                value={priceFilter} 
                                onChange={(e) => setPriceFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todos los precios</option>
                                <option value="low">Económico (≤ S/ 10)</option>
                                <option value="medium">Moderado (S/ 11-25)</option>
                                <option value="high">Premium (&gt; S/ 25)</option>
                            </select>
                        </div>

                        {/* Precio mínimo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio mínimo: S/ {minPrice}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Precio máximo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio máximo: S/ {maxPrice}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Ordenamiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'distance' | 'recent')}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="recent">Más recientes</option>
                                <option value="price-asc">Precio: menor a mayor</option>
                                <option value="price-desc">Precio: mayor a menor</option>
                                <option value="distance">Distancia (próximamente)</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón para limpiar filtros */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                setPriceFilter('all');
                                setSortBy('recent');
                                setMinPrice(0);
                                setMaxPrice(50);
                                setSearchLocation('');
                            }}
                            className="text-gray-600 hover:text-gray-800 text-sm underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>

                {/* Estadísticas de búsqueda */}
                <div className="mb-6 bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-600">{searchStats.filtered}</p>
                            <p className="text-sm text-gray-600">Resultados</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{searchStats.available}</p>
                            <p className="text-sm text-gray-600">Disponibles</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-600">S/ {searchStats.avgPrice}</p>
                            <p className="text-sm text-gray-600">Precio promedio</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-600">{searchStats.total}</p>
                            <p className="text-sm text-gray-600">Total registrados</p>
                        </div>
                    </div>
                </div>

                {/* Lista de estacionamientos */}
                {filteredAndSortedParkings.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No se encontraron estacionamientos
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Intenta ajustar tus filtros de búsqueda o explora otras ubicaciones.
                        </p>
                        <button
                            onClick={() => {
                                setPriceFilter('all');
                                setSortBy('recent');
                                setMinPrice(0);
                                setMaxPrice(50);
                                loadAllParkings();
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Ver todos los estacionamientos
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <p className="text-gray-600">
                                Mostrando {filteredAndSortedParkings.length} de {searchStats.available} estacionamientos disponibles
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAndSortedParkings.map((parking) => (
                                <ParkingCard
                                    key={parking.id}
                                    parking={parking}
                                    onView={() => handleViewParking(parking)}
                                    onReserve={() => handleReserveParking(parking)}
                                    isOwner={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to action para propietarios */}
                {parkings.length > 0 && (
                    <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">¿Tienes un espacio de estacionamiento?</h2>
                        <p className="mb-6 text-blue-100">
                            Únete a nuestra comunidad y comienza a generar ingresos con tu espacio disponible.
                        </p>
                        <a
                            href="/publish-garage"
                            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Registrar mi estacionamiento</span>
                        </a>
                    </div>
                )}
            </div>

            {/* Modal de detalles */}
            {viewingParking && (
                <ParkingDetailsModal
                    parking={viewingParking}
                    onClose={() => setViewingParking(null)}
                    isOwner={false}
                />
            )}
        </div>
    );
};

export default AllParkingsPage;