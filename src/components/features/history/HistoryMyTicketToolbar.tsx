import { useHistoryMyTicketActions, useHistoryMyTicketFilters } from '../../../store/historyMyTicketStore';
import { SearchBar } from '../../ui/SearchBar';
import { Button } from '../../ui/Button';
import { Filter } from 'lucide-react';

export const HistoryMyTicketToolbar = () => {
    const filters = useHistoryMyTicketFilters();
    const { setFilters } = useHistoryMyTicketActions();

    const handleSearch = (query: string) => {
        setFilters({ search: query });
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-grow">
                <SearchBar
                    value={filters.search || ''}
                    onSearch={handleSearch}
                    placeholder="Cari riwayat tiket Anda..."
                />
            </div>
            <Button variant="secondary" leftIcon={<Filter size={16} />}>
                Filter
            </Button>
        </div>
    );
};