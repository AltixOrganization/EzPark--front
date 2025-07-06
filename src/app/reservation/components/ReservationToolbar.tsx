// src/app/reservation/components/ReservationToolbar.tsx

import React, { useState } from 'react';

interface ReservationToolbarProps {
    selectedCount: number;
    totalCount: number;
    onBulkAction: (action: string) => void;
    onSelectAll: () => void;
    selectAll: boolean;
    onSearch: (query: string) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
}

const ReservationToolbar: React.FC<ReservationToolbarProps> = ({
    selectedCount,
    totalCount,
    onBulkAction,
    onSelectAll,
    selectAll,
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
                    {/* Select All */}
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={onSelectAll}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                            {selectedCount > 0 ? `${selectedCount} seleccionadas` : 'Seleccionar todo'}
                        </span>
                    </label>

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
                    {/* Bulk Actions */}
                    {selectedCount > 0 && (
                        <div className="flex items-center space-x-2 mr-4">
                            <div className="h-4 w-px bg-gray-300"></div>
                            <button
                                onClick={() => onBulkAction('Approved')}
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Aprobar ({selectedCount})
                            </button>
                            <button
                                onClick={() => onBulkAction('Cancelled')}
                                className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Rechazar ({selectedCount})
                            </button>
                        </div>
                    )}

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

export default ReservationToolbar;
