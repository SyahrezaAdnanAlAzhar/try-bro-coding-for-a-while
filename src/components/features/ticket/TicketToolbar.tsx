import { useTicketTableActions, useTicketTableFilters } from '../../../store/ticketTableStore';
import { SearchBar } from '../../ui/SearchBar';
import { Button } from '../../ui/Button';
import { Filter } from 'lucide-react';

export const TicketToolbar = () => {
    const filters = useTicketTableFilters();
    const { setFilters } = useTicketTableActions();

    const handleSearch = (query: string) => {
        setFilters({ search: query });
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-grow">
                <SearchBar
                    value={filters.search || ''}
                    onSearch={handleSearch}
                    placeholder="Cari berdasarkan deskripsi tiket..."
                />
            </div>
            <Button variant="blue-mtm-dark" leftIcon={<Filter size={16} />}>
                Filter
            </Button>
        </div>
    );
};