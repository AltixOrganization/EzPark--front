// src/app/vehicle/components/BrandModelManager.tsx

import React, { useEffect, useState } from 'react';
import { useVehicle } from '../hooks/useVehicle';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import type { CreateBrandRequest, CreateModelRequest } from '../types/vehicle.types';

const BrandModelManager: React.FC = () => {
    const { 
        brands, 
        models, 
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
    const [selectedBrandId, setSelectedBrandId] = useState(0);

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
        } catch (err) {
            console.error('Error al crear modelo:', err);
        }
    };

    const filteredModels = selectedBrandId > 0 
        ? models.filter(model => model.brandId === selectedBrandId)
        : models;

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Marcas y Modelos</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sección de Marcas */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Marcas</h2>
                        <button
                            onClick={() => setShowBrandForm(!showBrandForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {showBrandForm ? 'Cancelar' : 'Agregar Marca'}
                        </button>
                    </div>

                    {showBrandForm && (
                        <form onSubmit={handleCreateBrand} className="mb-6 p-4 bg-gray-50 rounded">
                            <div className="mb-3">
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
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={brandForm.description}
                                    onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Crear Marca
                            </button>
                        </form>
                    )}

                    <div className="space-y-2">
                        {brands.map(brand => (
                            <div key={brand.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <h3 className="font-medium">{brand.name}</h3>
                                    <p className="text-sm text-gray-600">{brand.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedBrandId(brand.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Ver Modelos
                                    </button>
                                    <button
                                        onClick={() => deleteBrand(brand.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de Modelos */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Modelos {selectedBrandId > 0 && `(${brands.find(b => b.id === selectedBrandId)?.name})`}
                        </h2>
                        <button
                            onClick={() => setShowModelForm(!showModelForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={brands.length === 0}
                        >
                            {showModelForm ? 'Cancelar' : 'Agregar Modelo'}
                        </button>
                    </div>

                    {selectedBrandId > 0 && (
                        <button
                            onClick={() => setSelectedBrandId(0)}
                            className="mb-4 text-sm text-gray-600 hover:text-gray-800"
                        >
                            ← Ver todos los modelos
                        </button>
                    )}

                    {showModelForm && (
                        <form onSubmit={handleCreateModel} className="mb-6 p-4 bg-gray-50 rounded">
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Marca
                                </label>
                                <select
                                    value={modelForm.brandId}
                                    onChange={(e) => setModelForm(prev => ({ ...prev, brandId: Number(e.target.value) }))}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                >
                                    <option value={0}>Selecciona una marca</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
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
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={modelForm.description}
                                    onChange={(e) => setModelForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Crear Modelo
                            </button>
                        </form>
                    )}

                    <div className="space-y-2">
                        {filteredModels.map(model => (
                            <div key={model.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <h3 className="font-medium">{model.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {brands.find(b => b.id === model.brandId)?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">{model.description}</p>
                                </div>
                                <button
                                    onClick={() => deleteModel(model.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandModelManager;
