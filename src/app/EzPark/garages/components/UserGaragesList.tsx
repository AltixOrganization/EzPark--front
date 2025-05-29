import React from 'react'
import { Link } from 'react-router-dom';

const UserGaragesList: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Mis Garajes</h1>
            <p className="text-gray-600">Aquí aparecerán los garajes que has creado.</p>
            <div className="mt-8">
                <p className="text-gray-500">No tienes garajes creados aún.</p>
                <Link to="/publish-garage">
                    <button>agregar garaje</button>
                </Link>            </div>
        </div>
    );
};

export default UserGaragesList;
