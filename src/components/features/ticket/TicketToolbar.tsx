import { useTicketTableActions, useTicketTableFilters, useTicketTableStore } from '../../../store/ticketTableStore';
import { SearchBar } from '../../ui/SearchBar';
import { useSelectedDepartmentId } from '../../../store/departmentStore';
import { FilterTrigger } from '../filter/FilterTrigger';

export const TicketToolbar = () => {
    const filters = useTicketTableFilters();
    const { setFilters, applyFilters } = useTicketTableActions();
    const selectedDepartmentId = useSelectedDepartmentId();

    const handleSearch = (query: string) => {
        setFilters({ search: query });
        applyFilters();
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
            <FilterTrigger
                storeHook={useTicketTableStore}
                fetchParams={{ sectionId: 2, departmentTargetId: selectedDepartmentId }}
            />
        </div>
    );
};