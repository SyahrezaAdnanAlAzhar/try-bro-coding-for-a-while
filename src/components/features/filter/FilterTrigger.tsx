import { useState } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { Button } from "../../ui/Button";
import { FilterModal } from "./FilterModal";
import { Filter } from "lucide-react";
import { useAuthStatus } from "../../../store/authStore";

type FilterableStore = {
    filterOptions: any;
    selectedFilters: any;
    actions: {
        fetchFilterOptions: (params: any) => Promise<void>;
        setSelectedFilter: (filterType: any, value: any) => void;
        applyFilters: () => void;
        resetFilters: () => void;
    };
};

interface FilterTriggerProps {
    storeHook: UseBoundStore<StoreApi<FilterableStore>>;
    fetchParams: Record<string, any>; // e.g., { sectionId: 2, departmentTargetId: 5 }
}

export const FilterTrigger = ({ storeHook, fetchParams }: FilterTriggerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { filterOptions, selectedFilters, actions } = storeHook();
    const authStatus = useAuthStatus();

    if (authStatus !== 'authenticated') {
        return null;
    }

    const handleOpen = () => {
        actions.fetchFilterOptions(fetchParams);
        setIsOpen(true);
    };

    const handleApply = () => {
        actions.applyFilters();
        setIsOpen(false);
    };

    const handleReset = () => {
        actions.resetFilters();
        setIsOpen(false);
    };

    return (
        <>
            <Button variant="secondary" leftIcon={<Filter size={16} />} onClick={handleOpen}>
                Filter
            </Button>
            <FilterModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                options={filterOptions}
                selectedFilters={selectedFilters}
                onFilterChange={actions.setSelectedFilter}
                onApply={handleApply}
                onReset={handleReset}
            />
        </>
    );
};