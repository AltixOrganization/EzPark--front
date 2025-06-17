// src/app/vehicle/pages/AdminVehiclesPage.tsx

import React from 'react';
import BrandModelManager from '../components/BrandModelManager';

const AdminVehiclesPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Administración de Vehículos</h1>
                <p className="text-gray-600 mt-2">
                    Gestiona las marcas y modelos de vehículos disponibles en el sistema.
                </p>
            </div>
            
            <BrandModelManager />
        </div>
    );
};

export default AdminVehiclesPage;
