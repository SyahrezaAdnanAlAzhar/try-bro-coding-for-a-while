import { useState, useEffect, type FC } from 'react';
import { Search, Delete } from 'lucide-react';
import { Input } from './Input';

export interface SearchBarProps {
    value: string;
    onSearch: (query: string) => void;
    debounceMs?: number;
    isLoading?: boolean;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}


export const SearchBar: FC<SearchBarProps> = ({
    value,
    onSearch,
    debounceMs = 1000,
    isLoading = false,
    placeholder = 'Search...',
    disabled = false,
    className,
}) => {
    const [query, setQuery] = useState(value);

    useEffect(() => {
        if (query === value) {
            return;
        }

        const handler = setTimeout(() => {
            onSearch(query);
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [query, debounceMs, onSearch, value]);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                <Search className="text-blue-mtm-400" size={16} aria-hidden="true" />
            </div>

            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={disabled || isLoading}
                className="rounded-full pl-16 pr-10 py-6"
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-mtm-400"></div>
                ) : query ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-full p-1 text-add-red hover:bg-add-red/10 focus:outline-none focus:ring-2 focus:ring-add-red"
                        aria-label="Clear search"
                    >
                        <Delete className="h-5 w-5" />
                    </button>
                ) : null}
            </div>
        </div>
    );
};