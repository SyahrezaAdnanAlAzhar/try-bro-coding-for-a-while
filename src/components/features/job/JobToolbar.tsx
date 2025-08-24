import { SearchBar } from '../../ui/SearchBar';
import { Button } from '../../ui/Button';
import { Filter } from 'lucide-react';

export const JobToolbar = () => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-grow">
                <SearchBar
                    value={""}
                    onSearch={() => { }}
                    placeholder="Cari berdasarkan deskripsi job..."
                />
            </div>
            <Button variant="secondary" leftIcon={<Filter size={16} />}>
                Filter
            </Button>
        </div>
    );
};