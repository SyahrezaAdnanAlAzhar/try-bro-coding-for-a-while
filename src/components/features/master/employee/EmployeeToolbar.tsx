import { useState } from 'react';
import { Filter } from 'lucide-react';
import { SearchBar } from '../../../ui/SearchBar';
import { Button } from '../../../ui/Button';
import { useMasterEmployeeActions } from '../../../../store/masterEmployeeStore';

export const EmployeeToolbar = () => {
    const { setFilters } = useMasterEmployeeActions();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (query: string) => {
        setFilters({ name: query, npk: query });
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-grow">
                <SearchBar
                    value={searchTerm}
                    onSearch={handleSearch}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari berdasarkan NPK atau Nama..."
                />
            </div>
            <Button variant="secondary" leftIcon={<Filter size={16} />}>
                Filter
            </Button>
        </div>
    );
};