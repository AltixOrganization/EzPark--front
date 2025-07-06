// src/app/reservation/components/SimpleReservationToolbar.tsx

import React, { useState } from 'react';

interface SimpleReservationToolbarProps {
    totalCount: number;
    onSearch: (query: string) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
}

const SimpleReservationToolbar: React.FC<SimpleReservationToolbarProps> = ({
    totalCount,
    onSearch,
    onSort
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleSort = (field: string) => {
        const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortField(field);
        setSortDirection(newDirection);
        onSort(field, newDirection);
        setShowSortMenu(false);
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'desc' ? '↓' : '↑';
    };

    return (
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por cliente, email, placa..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    onSearch('');
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="text-sm text-gray-500">
                        {totalCount} solicitud{totalCount !== 1 ? 'es' : ''}
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    {/* Sort Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            Ordenar {getSortIcon(sortField)}
                        </button>

                        {showSortMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleSort('createdAt')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortField === 'createdAt' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        Fecha de solicitud {getSortIcon('createdAt')}
                                    </button>
                                    <button
                                        onClick={() => handleSort('reservationDate')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortField === 'reservationDate' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        Fecha de reserva {getSortIcon('reservationDate')}
                                    </button>
                                    <button
                                        onClick={() => handleSort('totalFare')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortField === 'totalFare' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        Monto {getSortIcon('totalFare')}
                                    </button>
                                    <button
                                        onClick={() => handleSort('guest')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortField === 'guest' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        Cliente {getSortIcon('guest')}
                                    </button>
                                    <button
                                        onClick={() => handleSort('hoursRegistered')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortField === 'hoursRegistered' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        Duración {getSortIcon('hoursRegistered')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                    Mostrando resultados para "{searchQuery}"
                </div>
            )}
        </div>
    );
};

export default SimpleReservationToolbar;
