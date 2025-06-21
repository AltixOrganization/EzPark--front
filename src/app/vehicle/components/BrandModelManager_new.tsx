// src/app/vehicle/components/BrandModelManager.tsx

import React, { useEffect, useState } from 'react';
import { useVehicle } from '../hooks/useVehicle';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { CreateBrandRequest, CreateModelRequest } from '../types/vehicle.types';

const BrandModelManager: React.FC = () => {
    const { 
        brands, 
        loading, 
        error, 
        loadAllBrands, 
        createBrand, 
        createModel,
        deleteBrand,
        deleteModel
    } = useVehicle();

    const [showBrandForm, setShowBrandForm] = useState(false);
    const [showModelForm, setShowModelForm] = useState(false);
    const [selectedBrandForModel, setSelectedBrandForModel] = useState(0);
    const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set());

    const [brandForm, setBrandForm] = useState<CreateBrandRequest>({
        name: '',
        description: ''
    });

    const [modelForm, setModelForm] = useState<CreateModelRequest>({
        brandId: 0,
        name: '',
        description: ''
    });

    useEffect(() => {
        loadAllBrands();
    }, [loadAllBrands]);

    const toggleBrandExpansion = (brandId: number) => {
        const newExpanded = new Set(expandedBrands);
        if (newExpanded.has(brandId)) {
            newExpanded.delete(brandId);
        } else {
            newExpanded.add(brandId);
        }
        setExpandedBrands(newExpanded);
    };

    const handleCreateBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBrand(brandForm);
            setBrandForm({ name: '', description: '' });
            setShowBrandForm(false);
        } catch (err) {
            console.error('Error al crear marca:', err);
        }
    };

    const handleCreateModel = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createModel(modelForm);
            setModelForm({ brandId: 0, name: '', description: '' });
            setShowModelForm(false);
            setSelectedBrandForModel(0);
        } catch (err) {
            console.error('Error al crear modelo:', err);
        }
    };

    const startCreateModel = (brandId: number) => {
        setSelectedBrandForModel(brandId);
        setModelForm({ brandId, name: '', description: '' });
        setShowModelForm(true);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestión de Marcas y Modelos</h2>
                <button
                    onClick={() => setShowBrandForm(!showBrandForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showBrandForm ? 'Cancelar' : 'Agregar Marca'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Formulario de crear marca */}
            {showBrandForm && (
                <form onSubmit={handleCreateBrand} className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Agregar Nueva Marca</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la Marca
                            </label>
                            <input
                                type="text"
                                value={brandForm.name}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <input
                                type="text"
                                value={brandForm.description}
                                onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Crear Marca
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowBrandForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Formulario de crear modelo */}
            {showModelForm && (
                <form onSubmit={handleCreateModel} className="bg-blue-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">
                        Agregar Modelo para {brands.find(b => b.id === selectedBrandForModel)?.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Modelo
                            </label>
                            <input
                                type="text"
                                value={modelForm.name}
                                onChange={(e) => setModelForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <input
                                type="text"
                                value={modelForm.description}
                                onChange={(e) => setModelForm(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Crear Modelo
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowModelForm(false);
                                setSelectedBrandForModel(0);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Lista de marcas con modelos desplegables */}
            <div className="space-y-4">
                {brands.map(brand => (
                    <div key={brand.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        {/* Header de la marca */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => toggleBrandExpansion(brand.id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg 
                                            className={`w-5 h-5 transform transition-transform ${
                                                expandedBrands.has(brand.id) ? 'rotate-90' : ''
                                            }`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{brand.name}</h3>
                                        <p className="text-sm text-gray-500">{brand.description}</p>
                                        <p className="text-xs text-gray-400">
                                            {brand.models?.length || 0} modelo(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startCreateModel(brand.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                        Agregar Modelo
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`¿Eliminar la marca "${brand.name}" y todos sus modelos?`)) {
                                                deleteBrand(brand.id);
                                            }
                                        }}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lista de modelos (desplegable) */}
                        {expandedBrands.has(brand.id) && (
                            <div className="p-4">
                                {brand.models && brand.models.length > 0 ? (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Modelos:</h4>
                                        {brand.models.map(model => (
                                            <div 
                                                key={model.id} 
                                                className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                                            >
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{model.name}</h5>
                                                    <p className="text-sm text-gray-600">{model.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`¿Eliminar el modelo "${model.name}"?`)) {
                                                            deleteModel(model.id);
                                                        }
                                                    }}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <p className="text-sm">No hay modelos para esta marca</p>
                                        <button
                                            onClick={() => startCreateModel(brand.id)}
                                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Agregar el primer modelo
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {brands.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    <p>No hay marcas registradas</p>
                    <button
                        onClick={() => setShowBrandForm(true)}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                        Agregar la primera marca
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrandModelManager;
