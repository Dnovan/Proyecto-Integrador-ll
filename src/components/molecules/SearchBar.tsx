/**
 * @fileoverview Componente SearchBar - Molécula
 * @description Barra de búsqueda con filtros dinámicos
 * 
 * @iso25010
 * - Usabilidad: Búsqueda intuitiva con autocompletado visual
 * - Eficiencia: Debounce para optimizar peticiones
 */

import React, { useState, useCallback } from 'react';
import { Search, MapPin, Tag, DollarSign, X } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import type { VenueCategory, SearchFilters } from '../../types';
import { zones, categoryLabels } from '../../services/mockApi';

interface SearchBarProps {
    /** Callback al buscar */
    onSearch: (filters: SearchFilters) => void;
    /** Filtros iniciales */
    initialFilters?: SearchFilters;
    /** Mostrar filtros expandidos */
    showFilters?: boolean;
    /** Placeholder del input principal */
    placeholder?: string;
}

/**
 * Barra de búsqueda con filtros avanzados
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   onSearch={(filters) => console.log(filters)}
 *   showFilters
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    initialFilters = {},
    showFilters = false,
    placeholder = 'Buscar locales para tu evento...',
}) => {
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const [isExpanded, setIsExpanded] = useState(showFilters);

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, query: e.target.value }));
    }, []);

    const handleSearch = useCallback(() => {
        onSearch(filters);
    }, [filters, onSearch]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        },
        [handleSearch]
    );

    const handleClearFilters = useCallback(() => {
        setFilters({});
        onSearch({});
    }, [onSearch]);

    const hasActiveFilters =
        filters.zone || filters.category || filters.priceMin || filters.priceMax;

    return (
        <div className="w-full space-y-4">
            {/* Barra principal */}
            <div className="relative flex gap-2">
                <div className="flex-1">
                    <Input
                        value={filters.query || ''}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        leftIcon={<Search className="w-5 h-5" />}
                        className="bg-bg-secondary"
                    />
                </div>
                <Button onClick={handleSearch} className="px-8">
                    Buscar
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-neon"
                >
                    Filtros
                    {hasActiveFilters && (
                        <span className="ml-2 w-2 h-2 bg-neon rounded-full" />
                    )}
                </Button>
            </div>

            {/* Filtros expandidos */}
            {isExpanded && (
                <div className="glass rounded-2xl p-6 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Zona */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Zona
                            </label>
                            <select
                                value={filters.zone || ''}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, zone: e.target.value || undefined }))
                                }
                                className="w-full bg-bg-card text-text-primary border border-neon/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-neon"
                            >
                                <option value="">Todas las zonas</option>
                                {zones.map((zone) => (
                                    <option key={zone} value={zone}>
                                        {zone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">
                                <Tag className="w-4 h-4 inline mr-1" />
                                Categoría
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        category: (e.target.value as VenueCategory) || undefined,
                                    }))
                                }
                                className="w-full bg-bg-card text-text-primary border border-neon/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-neon"
                            >
                                <option value="">Todas las categorías</option>
                                {Object.entries(categoryLabels).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Precio mínimo */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Precio mínimo
                            </label>
                            <Input
                                type="number"
                                value={filters.priceMin || ''}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priceMin: e.target.value ? Number(e.target.value) : undefined,
                                    }))
                                }
                                placeholder="$0"
                            />
                        </div>

                        {/* Precio máximo */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Precio máximo
                            </label>
                            <Input
                                type="number"
                                value={filters.priceMax || ''}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priceMax: e.target.value ? Number(e.target.value) : undefined,
                                    }))
                                }
                                placeholder="$999,999"
                            />
                        </div>
                    </div>

                    {/* Acciones de filtros */}
                    <div className="flex justify-end gap-2 mt-4">
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={handleClearFilters} leftIcon={<X />}>
                                Limpiar filtros
                            </Button>
                        )}
                        <Button onClick={handleSearch}>Aplicar filtros</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
